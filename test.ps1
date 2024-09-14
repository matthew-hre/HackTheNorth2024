# Function to move and resize windows based on a JSON object input
function Move-ResizeProcesses {
    param (
        [Parameter(Mandatory=$true)]
        [Object]$jsonInput
    )

    # Define screen width and height
    $screenWidth = 1550
    $screenHeight = 830

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
    foreach ($app in $jsonInput) {
        # Extract details from JSON
        $appName = $app.Name
        $X = [math]::Round($app.X * $screenWidth)
        $Y = [math]::Round($app.Y * $screenHeight)
        $Width = [math]::Round($app.Width * $screenWidth)
        $Height = [math]::Round($app.Height * $screenHeight)

        # Start the application process
        $process = Start-Process -FilePath $appName -PassThru
        $process.WaitForInputIdle()
        $waitTime = 500;
        if ($appName -eq 'code') {
            $waitTime = 5000;
        }
        # Wait until the process has a valid MainWindowHandle
        $h = $null
        while (-not $h) {
            Start-Sleep -Milliseconds $waitTime
            $h = (Get-Process -Name $appName -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }).MainWindowHandle
        }

        # Ensure we only have one handle
        $h = $h | Select-Object -First 1

        # Variables to use as reference for position calls
        $rcWindow = New-Object RECT
        $rcClient = New-Object RECT

        # Get the window coordinates
        [void][Win32]::GetWindowRect($h, [ref]$rcWindow)
        [void][Win32]::GetClientRect($h, [ref]$rcClient)

        # Move and resize the window
        [void][Win32]::MoveWindow($h, $X, $Y, $Width, $Height, $true)
    }
}

# Example JSON input
$json = @"
[
    {
        "Name":  "chrome",
        "X":  0.5,
        "Y":  0,
        "Width":  0.5,
        "Height":  0.5
    },
    {
        "Name":  "Notepad",
        "X":  0.5,
        "Y":  0.5,
        "Width":  0.5,
        "Height":  0.5
    },
    {
        "Name":  "Notepad",
        "X":  0.25,
        "Y":  0.5,
        "Width":  0.5,
        "Height":  0.5
    },
    {
        "Name":  "code",
        "X":  0,
        "Y":  0,
        "Width":  0.5,
        "Height":  1
    }
]
"@

# Convert JSON input to PowerShell object
$jsonInput = $json | ConvertFrom-Json

# Call the function with the JSON object
Move-ResizeProcesses -jsonInput $jsonInput
