async function playNzp() {
    // get installation path
    const installPath = localStorage.getItem("installationLocation");

    // launch nz:p
    await window.electronAPI.launchNzp(installPath);
}
window.playNzp = playNzp;