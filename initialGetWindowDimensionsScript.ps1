# List of process names to exclude
$excludedProcesses = @(
    "explorer",
    "RtkUWP",
    "SystemSettings",
    "TextInputHost",
    "CodeSetup-stable-38c31bc77e0dd6ae88a4e9cc93428cc27a56ba40.tmp",
    "Adobe Desktop Service",
    "ApplicationFrameHost"
)

# Get the video mode description
$videoModeDescription = (Get-WmiObject -Class Win32_VideoController).VideoModeDescription

# Split the description by spaces
$parts = $videoModeDescription -split ' '

# Extract width and height assuming they are the first and third elements
$screenWidth = [int]$parts[0]
$screenHeight = [int]$parts[2]

# Create the screen object with fractional values
$windows = @()

# Add-Type block to interact with windows via user32.dll
if (-not ([System.Management.Automation.PSTypeName]'Window').Type) {
    Add-Type @"
        using System;
        using System.Runtime.InteropServices;

        public class Window {
            [DllImport("user32.dll")]
            [return: MarshalAs(UnmanagedType.Bool)]
            public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
        }

        public struct RECT {
            public int Left;
            public int Top;
            public int Right;
            public int Bottom;
        }
"@
}

# Get information about open windows
Get-Process | ForEach-Object {
    if ($_.MainWindowHandle -ne 0 -and -not $excludedProcesses.Contains($_.Name)) {
        $rect = New-Object RECT
        [Window]::GetWindowRect($_.MainWindowHandle, [ref]$rect) > $null
        $width = $rect.Right - $rect.Left
        $height = $rect.Bottom - $rect.Top

        # Convert dimensions and position to fractions of screen size
        $xFraction = [math]::Round($rect.Left / $screenWidth, 4)
        $yFraction = [math]::Round($rect.Top / $screenHeight, 4)
        $widthFraction = [math]::Round($width / $screenWidth, 4)
        $heightFraction = [math]::Round($height / $screenHeight, 4)

        # Add the window object to the list with fractional values
        $windows += [pscustomobject]@{
            Name   = $_.Name
            X      = $xFraction
            Y      = $yFraction
            Width  = $widthFraction
            Height = $heightFraction
        }
    }
}

# Output the information as JSON
$windows | ConvertTo-Json | Out-File -FilePath "information.json"
