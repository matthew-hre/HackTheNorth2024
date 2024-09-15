import pywinauto
import json

with open('information.json', 'r') as file:
    data = file.read()
    data = data[3:]
data = json.loads(data)

if any(item['application'] == 'chrome' for item in data):
    desktop = pywinauto.Desktop(backend="uia")
    window = desktop.windows(title_re=".*Chrome.*", control_type="Pane")[0]
    window.set_focus()
    wrapper_list = window.descendants(control_type="TabItem")
    tabs = []

    for wrapper in wrapper_list:
        wrapper.click_input()
        wrapper_url = window.descendants(title="Address and search bar", control_type="Edit")[0]
        url = wrapper_url.get_value()
        tabs.append(url)
    
    chrome_app = next((item for item in data if item['application'] == 'chrome'), None)
    if chrome_app:
        # Add a new key-value pair
        chrome_app['tabs'] = tabs
        print(data)