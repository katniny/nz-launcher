// create event
const userSelectFolderEvent = new CustomEvent("userSelectedFolder", {
    detail: { folderPath: "/some/path" }
});

export async function changeInstallLocation() {
    // get folder
    const folder = await window.electronAPI.selectFolder();
    if (folder) {
        // set local storage then dispatch event to let other scripts know
        localStorage.setItem("installationLocation", folder);
        const event = new CustomEvent("userSelectFolder", { detail: { folderPath: folder } });
        document.dispatchEvent(event);
    }
    else
        console.log("User canceled folder selection.");
}
window.changeInstallLocation = changeInstallLocation;