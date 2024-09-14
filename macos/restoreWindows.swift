import Foundation
import Cocoa

func shell(_ args: String...) -> Int32 {
    let task = Process()
    task.launchPath = "/bin/zsh"
    task.arguments = args
    task.launch()
    task.waitUntilExit()
    return task.terminationStatus
}

let SUPPORTED_PROGRAMS = ["Visual Studio Code", "Code", "Google Chrome", "Notes", "TextEdit"]

// Loop through each window and restore it
// Read json data
let file = "windows.json"
let url: URL = URL(fileURLWithPath: file)
let data = try Data(contentsOf: url)
let json = try JSONSerialization.jsonObject(with: data, options: []) as! [String: [String: Any]]

// TODO: close all windows

var safariCount: Int = 0;
var vscodeCount: Int = 0;
var chromeCount: Int = 0;
for (_, value) in json {

    if !SUPPORTED_PROGRAMS.contains(value["application"] as! String) {
        print(value["application"] as! String)
        print("Application not supported.")
        continue
    }

    var application = value["application"] as! String

    // Convert applications
    if application == "Code" {
        application = "Visual Studio Code"
    }
    
    let screenWidth = CGFloat(NSScreen.main?.frame.width ?? 0)    
    let screenHeight = CGFloat(NSScreen.main?.frame.height ?? 0)    

    // Read the dimensions from the file
    let x: Int = Int((value["x"] as! CGFloat) * screenWidth)
    let y: Int = Int((value["y"] as! CGFloat ) * screenHeight)
    let width: Int = Int((value["width"] as! CGFloat) * screenWidth)
    let height: Int = Int((value["height"] as! CGFloat) * screenHeight)
    let tabURLs: [String] = value["tabs"] as! [String]

    // Open window differently depending on the app and how many have been opened
    var restoreScript: String = "";
    var resizeScriptSet: Bool = false;
    var resizeScript: String = "";

    if application == "Safari"{
        if safariCount > 0{
            restoreScript = """
            osascript -e 'tell application "\(application)" to make new document'
            """
        }
        else{
            restoreScript = """
            osascript -e 'tell application "\(application)" to activate'
            """
        }
        safariCount += 1;
    }
    else if application == "Google Chrome"{
        if chromeCount > 0{
        restoreScript = """
            osascript -e 'tell application "Google Chrome" to activate
            tell application "System Events"
                keystroke "n" using {command down}
            end tell'
            """
        }
        else{
            restoreScript = """
            osascript -e 'tell application "\(application)" to activate'
            """
        }
        chromeCount += 1
    }
    else if application == "Notes"{
        restoreScript = "open -a Notes"
    }
    else if application == "TextEdit"{
        restoreScript = "open -a TextEdit /Users/jeffbrin/Desktop/htn/HackTheNorth2024/macos/testfile.txt"
    }
    else if application == "Visual Studio Code" || application == "Code"{
        if vscodeCount > 0{
            restoreScript = """
            osascript -e 'tell application "\(application)" to activate
            tell application "System Events"
                keystroke "n" using {command down, shift down}
            end tell'
            """
        }
        else{
            restoreScript = """
            osascript -e 'tell application "\(application)" to activate'
            """
        }
        vscodeCount += 1;


    resizeScript = """
        osascript -e 'tell application "System Events" to tell process "Code"
            tell window 1
                set size to {\(width), \(height)}
                set position to {\(x), \(y)}
            end tell
        end tell'
    """
    resizeScriptSet = true;
    }

    try restoreScript.write(toFile: "restoreWindows.sh", atomically: true, encoding: .utf8)

    // Run the script
    var cmd = "restoreWindows.sh"
    if shell(cmd) != 0 {
        print("Failed to restore.")
    } else {
        print("Successfully restored.")
    }

    // Create the custom "resize" script for the specific dimensions
    if !resizeScriptSet {
        resizeScript = """
        osascript -e 'tell app "\(application)"
            set bounds of window 1 to {\(x), \(y), \(x+width), \(y+height)}  
        end tell'
        """
    }

    // Open all the tabs
    if application == "Google Chrome"{
        for url: String in tabURLs{
            let openTabScript = """
                osascript -e 'set theURL to "\(url)"
                tell application "Google Chrome" to open location theURL'
            """
            let openTabScriptName = "openTab.sh"
            try openTabScript.write(toFile: openTabScriptName, atomically: true, encoding: .utf8)
            let _ = shell(openTabScriptName)

        }
    }
    sleep(1)

    // Write a command string to resizeWindows.sh
    try resizeScript.write(toFile: "resizeWindows.sh", atomically: true, encoding: .utf8)

    // Run the script
    cmd = "resizeWindows.sh"
    if shell(cmd) != 0 {
        print("Failed to run.")
    } else {
        print(application)
        print("Successfully run.")
    }
}