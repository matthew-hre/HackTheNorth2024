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
$windows = @()

$screenWidth = 1550
$screenHeight = 830
$chromeOpen = $false

# Get information about open windows
Get-Process | ForEach-Object {
    if ($_.MainWindowHandle -ne 0 -and -not $excludedProcesses.Contains($_.Name)) {
        $rect = New-Object RECT
        [Window]::GetWindowRect($_.MainWindowHandle, [ref]$rect) > $null
        $width = $rect.Right - $rect.Left;
        $height = $rect.Bottom - $rect.Top;

        $xFraction = [math]::Round($rect.Left / $screenWidth, 4)
        $yFraction = [math]::Round($rect.Top / $screenHeight, 4)
        $widthFraction = [math]::Round($width / $screenWidth, 4)
        $heightFraction = [math]::Round($height / $screenHeight, 4)

        $windows += [pscustomobject]@{
            application   = $_.Name
            x      = $xFraction
            y      = $yFraction
            width  = $widthFraction
            height = $heightFraction
        }
    }
}

$windows | ConvertTo-Json | % { [System.Text.RegularExpressions.Regex]::Unescape($_) } | Set-Content -Path "information.json" -Encoding utf8

python get_window_layout.py