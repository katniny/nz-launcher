// check if first time setup needs completed 
let hasFinishedSetup = null;

eel.user_prefs_exists()().then(exists => {
    hasFinishedSetup = exists;
    document.dispatchEvent(new Event("needsToDoSetup"));
});

// if need first time setup needs done, start 
document.addEventListener("needsToDoSetup", () => {
    console.log(hasFinishedSetup);
    if (hasFinishedSetup === true) {
        document.getElementById("launchStatus").textContent = "Fetching your launcher preferences...";
        
        // TO:DO FINISH
    } else {
        // TO:DO do setup
    }
});