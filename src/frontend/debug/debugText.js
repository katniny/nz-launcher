const launcherVersion = document.getElementById("launcherVersion");
const osVersion = document.getElementById("osVersion");
const nzpVersion = document.getElementById("nzpVersion");

// get launcher version
async function showVersion() {
    // request our launcher version
    const version = await window.electronAPI.getVersion();
    // then set text
    launcherVersion.textContent = `Launcher Version: v${version}`;
}
showVersion();

// get os version
let os;
let arch = localStorage.getItem("arch");
switch (localStorage.getItem("os")) {
    case "win32":
        os = "Windows";
        break;
    case "linux":
        os = "Linux";
    case "darwin":
        os = "macOS (Unsupported Platform)"
    default:
        os = "Unknown"
        break;
}
osVersion.textContent = `OS: ${arch} ${os}`;

// get nzp version