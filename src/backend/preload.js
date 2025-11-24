const { contextBridge, ipcRenderer } = require("electron");

// expose platform/arch
contextBridge.exposeInMainWorld("system", {
    platform: process.platform,
    arch: process.arch,
});

// when user wants to select a folder
contextBridge.exposeInMainWorld("electronAPI", {
    selectFolder: () => ipcRenderer.invoke("select-folder")
});