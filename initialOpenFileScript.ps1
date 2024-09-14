# User32 DLL call import
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
    public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);
  }
  public struct RECT
  {
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
  }
"@

# Variables to use as reference for position calls
$rcWindow = New-Object RECT
$rcClient = New-Object RECT

# Get open notepad
$ih = (Get-Process notepad -EA SilentlyContinue).MainWindowHandle | Select -First 1

notepad.exe

# Wait 1 second for notepad to open
Start-Sleep -Seconds 1

# Get the handles of all notepad processes
$h = (Get-Process notepad).MainWindowHandle | ? { $_ -ne $ih } | Select -First 1

# Get the window coordinates
[void][Win32]::GetWindowRect($ih,[ref]$rcWindow)
[void][Win32]::GetClientRect($ih,[ref]$rcClient)

# Move / Resize Window
[void][Win32]::MoveWindow($h, $rcWindow.Right, $rcWindow.Top, ($rcWindow.Right - $rcWindow.Left), ($rcWindow.Bottom - $rcWindow.Top), $true )
