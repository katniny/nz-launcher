// check if nz:p exists
async function nzpInstalled() {
    // get installation path
    const installPath = localStorage.getItem("installationLocation");

    // check if game is installed
    const isGameInstalled = await window.electronAPI.checkIfNzpInstalled(installPath);
    
    // if the game is installed, change the button/text
    if (isGameInstalled) {
        const installPlayButton = document.getElementById("installPlayButton");
        installPlayButton.textContent = "Play";
        installPlayButton.setAttribute("onclick", "playNzp()");
    }
}
nzpInstalled();