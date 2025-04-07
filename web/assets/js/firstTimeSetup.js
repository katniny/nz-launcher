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
        // start setup
        document.getElementById("launchStatus").textContent = "Please complete first time setup before using Nazi Zombies: Launcher!";
        licenseAgreement();
    }
});

// open source license agreement
function licenseAgreement() {
    const licenseAgreementDialog = document.createElement("dialog");
    licenseAgreementDialog.setAttribute("id", "licenseAgreement-dialog");
    licenseAgreementDialog.innerHTML = `
        <h1>Open Source License Agreement</h1>
        <p>Nazi Zombies: Portable is an open-source game, with <a href="https://github.com/nzp-team/quakec" target="_blank">QuakeC code licensed under GNU General Public License version 2</a> and <a href="https://github.com/nzp-team/assets" target="_blank">project assets licensed under CC-BY-SA 4.0</a>, and Nazi Zombies: Launcher is open source software licensed under the Mozilla Public License 2.0 license. By continuing to use this launcher, you agree to the Nazi Zombies: Portable licenses and the Nazi Zombies: Launcher license.</p>

        <br />

        <p>If you do not agree to these licenses, please close the launcher and cease use immediately.</p>

        <br />

        <button onclick="continueSetupPart2()">I agree</button>
        <button onclick="doesNotAcceptLicense()">I do not agree</button>
    `;

    document.body.appendChild(licenseAgreementDialog);
    licenseAgreementDialog.showModal();
}

function doesNotAcceptLicense() {
    document.getElementById("licenseAgreement-dialog").innerHTML = `
        <h1>Are you sure?</h1>
        <p>If you're sure, please cease use immediately. Otherwise, click the button below.</p>

        <br />

        <button onclick="continueSetupPart2()">Nevermind, I agree</button>
    `;
}

// step 2: allow auto updating and starting on system startup
function continueSetupPart2() {
    // update html
    document.getElementById("licenseAgreement-dialog").innerHTML = `
        <h1>Launcher Options</h1>
        <p>Configure Nazi Zombies: Launcher auto-updating and system startup. These can be changed at any time in the settings.</p>

        <br />

        <div>
            <label>
                <input type="checkbox" id="autoUpdate" checked />
                Auto-update Nazi Zombies: Launcher
            </label>
            <br />
            <small>Allow Nazi Zombies: Launcher to automatically update, ensuring you always have the latest security fixes, features, and improvements.</small>
        </div>

        <br />

        <div>
            <label>
                <input type="checkbox" id="startOnStartup" />
                Start on system start
            </label>
            <br />
            <small>Set Nazi Zombies: Launcher to launch automatically when your system starts, ensuring Nazi Zombies: Portable stays up-to-date without you needing to worry about it.</small>

            <br />
            <br />

            <button onclick="continueSetupPart3()">Continue</button>
        </div>
    `;

    // create userPrefs.txt
    eel.create_user_prefs()().then(function() {
        console.log("userPrefs.txt file created successfully!");
    }).catch(function(error) {
        console.error("Error occurred!", error);
    });
}

// step 3: check if user has existing install
function continueSetupPart3() {
    // write userPrefs.txt
    if (document.getElementById("autoUpdate").checked) {
        eel.write_user_prefs("allowAutoUpdating=True\n")(response => {
            console.log("Wrote auto update preference.");
        });
    } else {
        eel.write_user_prefs("allowAutoUpdating=False\n")(response => {
            console.log("Wrote auto update preference.");
        });
    }

    if (document.getElementById("startOnStartup").checked) {
        eel.write_user_prefs("startOnStartup=True\n")(response => {
            console.log("Wrote auto update preference.");
        });
    } else {
        eel.write_user_prefs("startOnStartup=False\n")(response => {
            console.log("Wrote auto update preference.");
        });
    }

    // update html
    document.getElementById("licenseAgreement-dialog").innerHTML = `
        <h1>Existing Install</h1>
        <p>Do you have an existing Nazi Zombies: Portable installation? If you do, select the folder (NOT THE EXECUTABLE) its in. Otherwise, click "I don't".</p>

        <small>Please note that you may see an alert that says to only upload the files you trust the site. Please note that we don't upload this anywhere, and this is only used to launch, update and modify the game (when applicable, e.g. installing mods).</small>

        <br />
        <br />

        <label for="folderInput">Enter Folder Path:</label>
        <br />
        <input type="text" id="folderPath" placeholder="C:/Path/To/NZP" />
        <a href="javascript:void(0);" onclick="helpGettingPath();">Unsure how to insert folder path? Click here.</a>

        <br />
        <br />

        <button onclick="checkNZPPath()">Continue</button> <button onclick="continueSetupPart4()">I don't</button>
    `;

    // set user os and arch
    eel.get_system_info()(response => {
        console.log("Saved OS and arch.");
    });
}

function checkNZPPath() {
    const execPath = document.getElementById("folderPath").value;

    eel.check_executable(execPath)(response => {
        if (response === true) {
            continueSetupPart4();
        } else {
            document.getElementById("licenseAgreement-dialog").innerHTML = `
                <h1>Unable to find installation</h1>
                <p>Make sure you are in the base, not in the NZP subdirectory, and that Nazi Zombies: Launcher has the correct permissions to access the folder.</p>


                <br />
                <br />

                <button id="findInstallationCorrection">Got it!</button>
            `;

            document.getElementById("findInstallationCorrection").addEventListener("click", () => {
                document.getElementById("licenseAgreement-dialog").innerHTML = `
                    <h1>Existing Install</h1>
                    <p>Do you have an existing Nazi Zombies: Portable installation? If you do, select the folder (NOT THE EXECUTABLE) its in. Otherwise, click "I don't".</p>

                    <small>Please note that you may see an alert that says to only upload the files you trust the site. Please note that we don't upload this anywhere, and this is only used to launch, update and modify the game (when applicable, e.g. installing mods).</small>

                    <br />
                    <br />

                    <label for="folderInput">Enter Folder Path:</label>
                    <br />
                    <input type="text" id="folderPath" placeholder="C:/Path/To/NZP" />
                    <a href="javascript:void(0);" onclick="helpGettingPath();">Unsure how to insert folder path? Click here.</a>

                    <br />
                    <br />

                    <button onclick="checkNZPPath()">Continue</button> <button onclick="continueSetupPart4()">I don't</button>
                `; 
            });
        }
    });
}