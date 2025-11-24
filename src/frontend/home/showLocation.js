const installationLocation = document.getElementById("nzpInstallLocation");
installationLocation.textContent = localStorage.getItem("installationLocation");
document.addEventListener("userSelectFolder", (e) => {
    installationLocation.textContent = e.detail.folderPath;
});