import Foundation

let restoreScript = """
    osascript -e 'tell application "Notes"
        activate
        tell application "System Events" to keystroke "t" using {command down}
    end tell'
"""

try restoreScript.write(toFile: "restoreWindows.sh", atomically: true, encoding: .utf8)


func shell(_ args: String...) -> Int32 {
    let task = Process()
    task.launchPath = "/bin/zsh"
    task.arguments = args
    task.launch()
    task.waitUntilExit()
    return task.terminationStatus
}

var cmd: String = "restoreWindows.sh"
if shell(cmd) != 0 {
        print("Failed to restore.")
    } else {
        print("Successfully restored.")
    }