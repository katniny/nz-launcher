let isConnected = null;

// check connection on launch
function checkConnection() {
    eel.is_connected()().then(connected => {
        if (connected) {
            isConnected = true;
            document.dispatchEvent(new Event("connectedToNetwork"));
        } else {
            isConnected = false;
            document.dispatchEvent(new Event("notConnectedToNetwork"));
        }
    });
}

checkConnection();

// then, check on 10 second intervals
setInterval(() => {
    checkConnection();
}, 10000);

// network change
document.addEventListener("connectedToNetwork", () => {
    // get rid of notConnected-dialog
    if (document.getElementById("notConnected-dialog")) {
       closeNoNetworkModal();
    }
});

document.addEventListener("notConnectedToNetwork", () => {
    // show notConnected-dialog
    if (!document.getElementById("notConnected-dialog")) {
        noNetworkModal();
    }
});

// GUI
function noNetworkModal() {
    const noNetworkModalDialog = document.createElement("dialog");
    noNetworkModalDialog.setAttribute("id", "notConnected-dialog");
    noNetworkModalDialog.innerHTML = `
        <h1>No connection</h1>
        <p>We were unable to connect to the internet. You may continue to the launcher but launcher services such as auto-updating will be unavailable due to dependency to the internet.</p>

        <br />

        <button onclick="continueUsingLauncher()">Continue Anyways</button>
        <button onclick="closeLauncher()">Close Launcher</button>
    `;

    document.body.appendChild(noNetworkModalDialog);
    noNetworkModalDialog.showModal();
}

function closeNoNetworkModal() {
    if (document.getElementById("notConnected-dialog")) {
        document.getElementById("notConnected-dialog").classList.add("closing");
        setTimeout(() => {
            document.getElementById("notConnected-dialog").remove();
        }, 250);
    }
}