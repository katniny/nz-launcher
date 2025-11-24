const { contextBridge, ipcRenderer } = require("electron");

// expose platform/arch
contextBridge.exposeInMainWorld("system", {
    platform: process.platform,
    arch: process.arch,
});

// when user wants to select a folder
// when launcher requests version
// when user wants to download the game
// when launcher requests download progress
contextBridge.exposeInMainWorld("electronAPI", {
    selectFolder: () => ipcRenderer.invoke("select-folder"),
    getVersion: () => ipcRenderer.invoke("get-app-version"),
    downloadAndUnzip: (url, installPath) => ipcRenderer.invoke("download-and-unzip", { url, installPath }),
    onDownloadProgress: (callback) => ipcRenderer.on("download-progress", (event, data) => callback(data)),
    onUnzipProgress: (callback) => ipcRenderer.on("unzip-progress", (event, data) => callback(data))
});