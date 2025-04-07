# start backend and frontend
import eel
from backend import hello1, hello2
import sys
import requests
import os
import platform
import easygui

eel.init("web")

@eel.expose
def call_hello1():
    hello1.say_hello()
    return hello1.say_hello()

@eel.expose
def call_hello2():
    hello2.say_hello()
    return hello2.say_hello()

# get if we're running in development mode or not
def is_frozen():
    return getattr(sys, "frozen", False)

@eel.expose 
def is_dev_mode():
    if not is_frozen():
        print("In development mode...")
    else:
        print("In production...")
    return not is_frozen()

# check our network connection
@eel.expose 
def is_connected():
    try:
        requests.get("https://example.com/", timeout=3)
        return True
    except requests.ConnectionError:
        return False

# check for userPrefs.txt
# this also doubles for if setup needs to be done
@eel.expose 
def user_prefs_exists():
    return os.path.isfile("userPrefs.txt")

# create userPrefs.txt
@eel.expose 
def create_user_prefs():
    # write text for curious users (also just for content)
    with open("userPrefs.txt", "w") as file:
        file.write("Please do not update this file manually!\nDoing so may negatively affect or damage your Nazi Zombies: Launcher install!\nThis file contains important information that Nazi Zombies: Launcher needs to function properly.\n\n")
    return "userPrefs.txt created!"

# write userPrefs
@eel.expose 
def write_user_prefs(data):
    with open("userPrefs.txt", "a") as file:
        file.write(data)
    return "userPrefs.txt has been updated."

# get user os and arch
@eel.expose 
def get_system_info():
    system = platform.system().lower()
    architecture = platform.architecture()[0]

    if system == "windows":
        if architecture == "32bit":
            write_user_prefs("userOS=windows32\n")
            return "windows32"
        elif architecture == "64bit":
            write_user_prefs("userOS=windows64\n")
            return "windows64"
    elif system == "linux":
        if architecture == "64bit":
            if "arm" in platform.machine().lower():
                if "aarch64" in platform.uname().machine:
                    write_user_prefs("userOS=linux_arm64\n")
                    return "linux_arm64"
                else:
                    write_user_prefs("userOS=linux_armhf\n")
                    return "linux_armhf"
            write_user_prefs("userOS=linux64\n")
            return "linux64"
    return "unknown"

# get nz:p install path (if provided)
@eel.expose 
def check_executable(path):
    try:
        folder_contents = os.listdir(path)
        print(f"Contents of folder at {path}:")
        for item in folder_contents:
            print(item)
    except FileNotFoundError:
        print(f"the path {path} was not found")
    except PermissionError:
        print(f"Permission denied to access {path}")

    with open("userPrefs.txt", "r") as file:
        lines = file.readlines()
        # ensure theres enough lines in the file (check line 7)
        # there should be, but just in case!
        if len(lines) >= 7:
            user_os_line = lines[6]
            if user_os_line.startswith("userOS="):
                user_os = user_os_line.strip().split("=")[1]
            else:
                print("Invalid userOS format in the file. Possibly tampered with.")
                return 
        else:
            print("userPrefs.txt does not have enough lines. Possibly tampered with.")
            return 
        
    # define the executable based on os
    if user_os == "windows32":
        executable_name = "nzportable-sdl32.exe"
    elif user_os == "windows64":
        executable_name = "nzportable-sdl64.exe"
    elif user_os == "linux64":
        executable_name = "nzportable64-sdl"
    elif user_os == "linux_arm64":
        executable_name = "nzportable64-sdl"
    elif user_os == "linux_armhf":
        executable_name = "nzportable64-sdl"
    else:
        print(f"Unsupported OS: {user_os}")
        return
    
    # check if exec exists
    executable_path = os.path.join(path, executable_name)
    if os.path.exists(executable_path):
        print(f"{executable_name} exists at {executable_path}")
        return True 
    else:
        print(f"{executable_name} does not exist at ${executable_path}")
        return False

eel.start("index.html", size=(1280, 720))