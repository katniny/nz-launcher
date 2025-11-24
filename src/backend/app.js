const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("node:path");
const fs = require("fs");
const { https } = require("follow-redirects");
const unzipper = require("unzipper");

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

// user wants to download the game
ipcMain.handle("download-and-unzip", async (event, { url, installPath }) => {
    const zipPath = path.join(installPath, "nzportable.zip");

    // ensure folder exists
    fs.mkdirSync(installPath, { recursive: true });

    // download file
    await new Promise((resolve, reject) => {
        const file = fs.createWriteStream(zipPath);

        https.get(url, response => {
            if (response.statusCode !== 200) return reject(new Error(`Failed to download. Status code: ${response.statusCode}`));

            // get amount returned to let client know download progress
            const totalSize = parseInt(response.headers["content-length"], 10);
            let downloaded = 0;

            // send progress to renderer
            response.on("data", chunk => {
                downloaded += chunk.length;
                event.sender.send("download-progress", { downloaded, totalSize });
            });

            response.pipe(file);
            file.on("finish", () => file.close(resolve));
        }).on("error", reject);
    });

    // unzip
    await new Promise(async (resolve, reject) => {
        // read zip first
        const directory = await unzipper.Open.file(zipPath);

        // calculate total uncompressed size of all files (ignoring directories)
        let totalBytes = 0;
        directory.files.forEach(file => {
            if (file.type === "File") totalBytes += file.uncompressedSize;
        });

        // keep track of how many bytes we've written so far
        let processedBytes = 0;

        // iterate through every entry in the zip
        for (const file of directory.files) {
            // where the file/folder will go
            const filePath = path.join(installPath, file.path);

            if (file.type === "Directory") {
                // create the folder if it doesn't exist
                fs.mkdirSync(filePath, { recursive: true });
            } else {
                // it's a file, stream it to disk
                await new Promise((res, rej) => {
                    file.stream()
                        .on("data", chunk => {
                            // increment processed bytes and calculate percent
                            processedBytes += chunk.length;
                            const percent = Math.floor((processedBytes / totalBytes) * 100);

                            // send progress info to renderer
                            event.sender.send("unzip-progress", { processedBytes, totalBytes, percent });
                        })
                        .pipe(fs.createWriteStream(filePath)) // write the file
                        .on("finish", res)
                        .on("error", rej);
                });
            }
        }

        // all files and folders processed
        resolve();
    });

    // delete zip
    fs.unlinkSync(zipPath);

    return true;
});

// launcher is requesting the app version
ipcMain.handle("launch-nzp", async (event, { installPath }) => {
    const { execFile, execSync } = require("child_process");

    // get executable path
    //"E:\\nzp-launcher-install\\nzportable-sdl64.exe"
    let execPath;
    if (process.platform === "win32") {
        if (process.arch === "x64")
            execPath = `${installPath}/nzportable-sdl64.exe`;
        else if (process.arch === "x32")
            execPath = `${installPath}/nzportable-sdl32.exe`;
    } else if (process.platform === "linux") {
        if (process.arch === "x64")
            execPath = `${installPath}/nzportable-sdl64`;
        else if (process.arch === "x32")
            execPath = `${installPath}/nzportable-sdl32`;
    }
    
    // on linux, make the game executable
    if (process.platform === "linux")
        execSync(`chmod +x "${execPath}"`, (err) => {
            if (err) throw err;
        });

    // run nzp
    // note: we NEED the extra arguments, or nz:p will fail to load and it'll just be fte
    execFile(execPath, ["default.fmf"], { cwd: installPath }, (err) => {
        if (err) throw err;
    });

    // else, all went well!
    return true;
});

// launcher is requesting to see if game is installed
ipcMain.handle("check-nzp-install", async (event, { installPath }) => {
    let execPath;
    if (process.platform === "win32") {
        if (process.arch === "x64")
            execPath = `${installPath}/nzportable-sdl64.exe`;
        else if (process.arch === "x32")
            execPath = `${installPath}/nzportable-sdl32.exe`;
    } else if (process.platform === "linux") {
        if (process.arch === "x64")
            execPath = `${installPath}/nzportable-sdl64`;
        else if (process.arch === "x32")
            execPath = `${installPath}/nzportable-sdl32`;
    }
    
    // check if file exists
    return fs.existsSync(execPath);
});