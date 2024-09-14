# Function to move and resize windows based on a JSON object input
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
    foreach ($app in $jsonInput) {
        $appName = $app.Name
        $X = $app.X * $screenWidth
        $Y = $app.Y * $screenHeight
        $Width = $app.Width * $screenWidth
        $Height = $app.Height * $screenHeight
        $Tabs = $app.Tabs
        $firstTab = $Tabs[0]
        $secondTab = $Tabs[1]

        $tempFolder = '--user-data-dir=c:\temp' # pick a temp folder for user data
        $startmode = '--start-fullscreen' # '--kiosk' is another option
        $startPage = 'https://stackoverflow.com'
        $windowSize = "--window-size=500,300"

        Start-Process -FilePath chrome -ArgumentList $tempFolder, $startPage, $startPage, $windowSize
        $h = (Get-Process -Name $appName -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }).MainWindowHandle
        $rcClient = New-Object RECT
        [void][Win32]::GetClientRect($h, [ref]$rcClient)
        [void][Win32]::MoveWindow($h, $X, $Y, $Width, $Height, $true)
        }
}

# Example JSON input
$json = @"
[
    {
        "Name":  "chrome",
        "X":  0.5,
        "Y":  0.5,
        "Width":  0.5,
        "Height":  0.5,
        "Tabs": ["google.com", "youtube.com"]
    }
]
"@

# Convert JSON input to PowerShell object
$jsonInput = $json | ConvertFrom-Json

# Call the function with the JSON object
Move-ResizeProcesses -jsonInput $jsonInput

#"--profile-directory=Default","--new-tab",
        #"--app=data:text/html,<html><body><script>window.moveTo($X,$Y);window.resizeTo($Width,$Height);window.location='https://$firstTab';</script></body></html>"
