$json = @"
[
    {
        "application":  "chrome",
        "x":  0,
        "y":  0,
        "width":  0.5,
        "height":  0.5,
        "tabs": ["google.com", "youtube.com", "moodle.com"]
    },
    {
        "application":  "code",
        "x":  0.5,
        "y":  0,
        "width":  0.5,
        "height":  1
    },
    {
        "application":  "Notepad",
        "x":  0,
        "y":  0.5,
        "width":  0.5,
        "height":  0.5
    }
]
"@

# Convert JSON input to PowerShell object
$jsonInput = $json | ConvertFrom-Json