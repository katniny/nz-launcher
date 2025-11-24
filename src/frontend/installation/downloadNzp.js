async function installNzp() {
    // get install path
    const installPath = localStorage.getItem("installationLocation");
    if (!installPath) return alert("No installation path set.");

    // get progress bar and 
    const downloadProgressDiv = document.getElementById("downloadProgress");
    const downloadProgress = document.getElementById("progressBar");
    const downloadProgressText = document.getElementById("downloadProgressText");
    const launcherInstallButton = document.getElementById("launcherInstallButton");
    const installPlayButton = document.getElementById("installPlayButton");

    // stitch together the download url
    const hostUrl = "https://github.com/nzp-team/nzportable/releases/download/nightly/nzportable-";
    let version;
    let archVer;
    let os = localStorage.getItem("os");
    let arch = localStorage.getItem("arch");
    // set os type
    if (os === "linux")
        version = "linux";
    else if (os === "win32")
        version = "win";
    // set arch version
    switch (arch) {
        case "x64":
            archVer = "64";
            break;
        case "x32":
            archVer = "32";
        case "arm":
            archVer = "armhf";
        case "arm64":
            archVer = "arm64";
        default:
            alert("Your CPU architecture is not supported by NZ:P. Sorry! :(");
            break;
            return;
    }

    // if windows and arm/arm64, return since nz:p does not support these versions
    if (os === "win32" && arch === "arm" || os === "win32" && arch === "arm64") {
        alert("Windows on ARM is not supported by NZ:P. Sorry!");
        return;
    }

    // string together the url
    let githubUrl;
    githubUrl = `${hostUrl}${version}${archVer}.zip`;

    // listen for progress
    window.electronAPI.onDownloadProgress(({ downloaded, totalSize }) => {
        // calculate percentage
        const percent = Math.floor((downloaded / totalSize) * 100);
    
        // convert 0-100% download -> 0-50% total
        const overallProgress = percent * 0.5;

        downloadProgress.value = overallProgress;
        downloadProgressText.textContent = `Downloading: ${percent}% done!`;
    });
    window.electronAPI.onUnzipProgress(({ percent }) => {
        const overallProgress = 50 + (percent * 0.5);

        downloadProgress.value = overallProgress;
        downloadProgressText.textContent = `Unzipping: ${percent}% done!`;
    });

    // finally, download nz:p
    try {
        // hide install ui & show progress bar
        downloadProgressDiv.style.display = "block";
        launcherInstallButton.style.display = "none";

        // request download & once finished, let user know
        await window.electronAPI.downloadAndUnzip(githubUrl, installPath);
        alert("Nazi Zombies: Portable has finished installing! Enjoy!");

        // show play ui & hide progress bar
        downloadProgressDiv.style.display = "none";
        launcherInstallButton.style.display = "block";

        // save to storage and turn button into play button
        localStorage.setItem("gameInstalled", true);
        installPlayButton.textContent = "Play";
        installPlayButton.setAttribute("onclick", "playNzp()");
    } catch (e) {
        console.error(e);
        alert("An error occurred while trying to install Nazi Zombies: Portable.");
    }
}
window.installNzp = installNzp;