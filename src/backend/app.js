const { app, BrowserWindow } = require("electron");
const path = require("node:path");

// create the window
let win;
function createWindow() {
    win = new BrowserWindow({
        // TODO: save preferences so its not starting 800x600 each launch
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    // load page
    win.loadFile("./pages/index.html");
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