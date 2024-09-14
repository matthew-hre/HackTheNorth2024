function Move-ResizeProcesses {
    param (
        [Parameter(Mandatory=$true)]
        [Object]$jsonInput
    )

    # Define screen width and height
    $screenWidth = 1536
    $screenHeight = 816

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
        public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int Width, int Height, bool bRepaint);
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
        $appName = $app.Name
        $X = $app.X * $screenWidth
        $Y = $app.Y * $screenHeight
        $Width = $app.Width * $screenWidth
        $Height = $app.Height * $screenHeight

        if ($appName -eq "chrome") 
        {
            $windowSize = "--window-size=$Width,$Height"
            $windowPosition = "--window-position=$X,$Y"

            $Tabs = $app.Tabs

            $tabsArgumentList = ''
            foreach ($tab in $Tabs) {
                $tabsArgumentList += "https://$tab" + " "
            }

            Start-Process -FilePath 'chrome' -ArgumentList $tabsArgumentList, $windowPosition, $windowSize
        }
        elseif ($appName -eq "code")
        {
            Start-Process -FilePath $appName -Wait

            $h = (Get-Process -Name $appName -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }).MainWindowHandle
            $rcClient = New-Object RECT
            [void][Win32]::GetClientRect($h, [ref]$rcClient)
            [void][Win32]::MoveWindow($h, $X, $Y, $Width, $Height, $true)
        }
        else
        {
            Start-Process -FilePath $appName
            Start-Sleep -Milliseconds 500

            $h = (Get-Process -Name $appName -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }).MainWindowHandle
            $rcClient = New-Object RECT
            [void][Win32]::GetClientRect($h, [ref]$rcClient)
            [void][Win32]::MoveWindow($h, $X, $Y, $Width, $Height, $true)
        }
    }
}

# Example JSON input
$json = @"
[
    {
        "Name":  "chrome",
        "X":  0,
        "Y":  0,
        "Width":  0.5,
        "Height":  0.5,
        "Tabs": ["google.com", "youtube.com", "moodle.com"]
    },
    {
        "Name":  "code",
        "X":  0.5,
        "Y":  0,
        "Width":  0.5,
        "Height":  1
    },
    {
        "Name":  "Notepad",
        "X":  0,
        "Y":  0.5,
        "Width":  0.5,
        "Height":  0.5
    }
]
"@

# Convert JSON input to PowerShell object
$jsonInput = $json | ConvertFrom-Json

# Call the function with the JSON object
Move-ResizeProcesses -jsonInput $jsonInput