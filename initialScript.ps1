Add-Type @"

	using System;

	using System.Runtime.InteropServices;

	public class Window {

	[DllImport("user32.dll")]

	[return: MarshalAs(UnmanagedType.Bool)]

	public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

	}

	public struct RECT

	{

	public int Left;        // x position of upper-left corner

	public int Top;         // y position of upper-left corner

	public int Right;       // x position of lower-right corner

	public int Bottom;      // y position of lower-right corner

	}

"@

Get-Process | ForEach-Object {

if ($_.MainWindowHandle -ne 0) {
$rect = New-Object RECT
[Window]::GetWindowRect($_.MainWindowHandle,[ref]$rect) > $null

"$($_.ProcessName) $($rect.Left) $($rect.Top) $($rect.Right) $($rect.Bottom)"
}
} | Out-File -FilePath "WindowPositions.txt"