import { detectOS } from "./detectOs.js";
import { changeInstallLocation } from "../installation/changeInstallLocation.js";

// html elements we need
const title = document.getElementById("title");
const description = document.getElementById("description");
const contentHTML = document.getElementById("content");

// start setup
async function startSetup() {
    // update ui then detect os
    contentHTML.innerHTML = `
        <p>Detecting your operating system...</p>
    `;
    const osDetails = await detectOS();

    // make a default location per os
    let defaultLocation;
    if (window.system.platform === "win32") {
        defaultLocation = `C:\\Program Files\\nzportable`;
        localStorage.setItem("installationLocation", "C:\\Program Files\\nzportable");
    } else if (window.system.platform === "linux") {
        defaultLocation = "/usr/bin/nzportable";
        localStorage.setItem("installationLocation", "/usr/bin/nzportable");
    } else {
        // assume *nix...
        defaultLocation = "/usr/bin/nzportable";
        localStorage.setItem("installationLocation", "/usr/bin/nzportable");
    }

    // then, ask if they want a default installation location
    title.textContent = "Setup: Default Installation Location";
    description.textContent = "Where would you like us to install Nazi Zombies: Portable?";
    contentHTML.innerHTML = `
        <p id="installationLocation">${defaultLocation}</p> <button onclick="changeInstallLocation()">Change</button>
        <br />
        <label>
            <input type="checkbox" id="askBeforeInstallation" />
            Ask where to install Nazi Zombies: Portable before downloading
        </label>

        <button onclick="finishSetup()">Finish</button>
    `;

    // listen for folder selection now
    const installationLocation = document.getElementById("installationLocation");
    document.addEventListener("userSelectFolder", (e) => {
        installationLocation.textContent = e.detail.folderPath;
    });
}

// detect if user is done with setup
async function isDoneWithSetup() {
    // get storage
    const isDone = localStorage.getItem("finishedSetup");

    // if done, redirect them to home
    // else, don't
    if (isDone)
        // go to home
        window.location.replace("home.html");
    else
        // start setup
        startSetup();
}
isDoneWithSetup();

// finish setup
function finishSetup() {
    // save that it's done
    localStorage.setItem("finishedSetup", true);

    // see if user wants nz:p to ask, and save pref
    const askBeforeInstallation = document.getElementById("askBeforeInstallation").checked;
    localStorage.setItem("askBeforeInstallation", askBeforeInstallation);

    // then, go to home
    window.location.replace("home.html");
}
window.finishSetup = finishSetup;