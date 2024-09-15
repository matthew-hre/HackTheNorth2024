function Move-ResizeProcesses {
    param (
        [Parameter(Mandatory=$true)]
        [Object]$jsonInput
    )

    # Define screen width and height
    $screenwidth = 1536
    $screenheight = 816

    # Add necessary user32 DLL calls
    Add-Type @"
      using System;
      using System.Runtime.InteropServices;
      public class Win32 {
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        public static extern bool GetClientRect(IntPtr hWnd, out RECT lpRect);
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        public static extern bool MoveWindow(IntPtr hWnd, int x, int y, int width, int height, bool bRepaint);
      }
      public struct RECT
      {
        public int Left;
        public int Top;
        public int Right;
        public int Bottom;
      }
"@

    # Process each application in the JSON input
    foreach ($app in $jsonInput) 
    {
        $appName = $app.application
        $x = $app.x * $screenwidth
        $y = $app.y * $screenheight
        $width = $app.width * $screenwidth
        $height = $app.height * $screenheight

        if ($appName -eq "chrome") 
        {
            $windowSize = "--window-size=$width,$height"
            $windowPosition = "--window-position=$x,$y"

            $tabs = $app.tabs

            $tabsList = ''
            foreach ($tab in $tabs) {
                $tabsList += "https://$tab" + " "
            }

            Start-Process -FilePath 'chrome' -ArgumentList $tabsList, $windowPosition, $windowSize
        }
        elseif ($appName -eq "code")
        {
            Start-Process -FilePath $appName -Wait

            $h = (Get-Process -Name $appName -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }).MainWindowHandle
            $rcClient = New-Object RECT
            [void][Win32]::GetClientRect($h, [ref]$rcClient)
            [void][Win32]::MoveWindow($h, $x, $y, $width, $height, $true)
        }
        else
        {
            Start-Process -FilePath $appName
            Start-Sleep -Milliseconds 500

            $h = (Get-Process -Name $appName -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }).MainWindowHandle
            $rcClient = New-Object RECT
            [void][Win32]::GetClientRect($h, [ref]$rcClient)
            [void][Win32]::MoveWindow($h, $x, $y, $width, $height, $true)
        }
    }
}

# Example JSON input
$json = @"
[
    {
        "application":  "chrome",
        "x":  0,
        "y":  0,
        "width":  0.5,
        "height":  0.5,
        "tabs": ["google.com", "youtube.com", "moodle.com"]
    },
    {
        "application":  "code",
        "x":  0.5,
        "y":  0,
        "width":  0.5,
        "height":  1
    },
    {
        "application":  "Notepad",
        "x":  0,
        "y":  0.5,
        "width":  0.5,
        "height":  0.5
    }
]
"@

# Convert JSON input to PowerShell object
$jsonInput = $json | ConvertFrom-Json

# Call the function with the JSON object
Move-ResizeProcesses -jsonInput $jsonInput