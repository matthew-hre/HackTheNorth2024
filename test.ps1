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

    # Function to get the main window handle of the process
    function Get-WindowHandle {
        param (
            [Parameter(Mandatory=$true)]
            [string]$processName
        )

        $process = Get-Process -Name $processName -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }
        if ($process) {
            return $process.MainWindowHandle
        }
        return $null
    }

    # Process each application in the JSON input
    foreach ($app in $jsonInput) {
        $appName = $app.Name
        $X = $app.X * $screenWidth
        $Y = $app.Y * $screenHeight
        $Width = $app.Width * $screenWidth
        $Height = $app.Height * $screenHeight

        # Start the application process
        $process = Start-Process $appName -PassThru -Wait
        
        $h = Get-WindowHandle -processName $appName | Select-Object -First 1

        $rcWindow = New-Object RECT
        $rcClient = New-Object RECT

        [void][Win32]::GetWindowRect($h, [ref]$rcWindow)
        [void][Win32]::GetClientRect($h, [ref]$rcClient)
        
        [void][Win32]::MoveWindow($h, $X, $Y, $Width, $Height, $true)
    }
}

# Example JSON input
$json = @"
[
    {
        "Name":  "code",
        "X":  0,
        "Y":  0,
        "Width":  0.5,
        "Height":  1
    },
    {
        "Name":  "chrome",
        "X":  0.5,
        "Y":  0.5,
        "Width":  0.5,
        "Height":  0.5
    },
    {
        "Name":  "chrome",
        "X":  0.5,
        "Y":  0,
        "Width":  0.5,
        "Height":  0.5
    }
]
"@

# Convert JSON input to PowerShell object
$jsonInput = $json | ConvertFrom-Json

# Call the function with the JSON object
Move-ResizeProcesses -jsonInput $jsonInput
