const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("node:path");

// create the window
let win;
function createWindow() {
    win = new BrowserWindow({
        // TODO: save preferences so its not starting 800x600 each launch
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // load page
    win.loadFile("./pages/setup.html");
}

// when ready, create window
app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});

// make sure the app fully quits
// NOTE: macos is not a supported platform as it is not supported by NZ:P
app.on("window-all-closed", ()  => {
    if (process.platform !== "darwin")
        app.quit();
});

// user wants to select a folder
ipcMain.handle("select-folder", async () => {
    const result = await dialog.showOpenDialog(win, {
        properties: ["openDirectory"]
    });
    if (result.canceled) return null;
    return result.filePaths[0];
});

// launcher is requesting the app version
ipcMain.handle("get-app-version", () => {
    return app.getVersion();
});