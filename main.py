# start backend and frontend
import eel
from backend import hello1, hello2
import sys
import requests
import os

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

eel.start("index.html", size=(1280, 720))