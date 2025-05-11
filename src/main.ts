import { app, BrowserWindow } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";

import { exec, spawn } from "node:child_process";
import { utilityProcess } from "electron";
import log from "electron-log";
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      preload: path.join(__dirname, "preload.js"),
      // devTools: false,  // - это отображение инструментов разработчика, отключает их
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

let serverProcess: any = null;

const startExpressServer = () => {
  const serverPath = path.join(__dirname, "../../src/backend/server.js");
  console.log(`тот самый путь - ${serverPath}`)
  log.info(`Starting server at: ${serverPath}`);
  serverProcess = spawn("node", [serverPath]);

  serverProcess.stdout.on("data", (data: any) => {
    log.info(`Server stdout: ${data}`);
  });

  serverProcess.stderr.on("data", (data: any) => {
    log.error(`Server stderr: ${data}`);
  });

  serverProcess.on("close", (code: any) => {
    log.info(`Server process exited with code ${code}`);
  });
};

// Function to stop the running process
const stopExpressServer = () => {
  if (serverProcess) {
    // Terminate the process
    const killer = serverProcess.kill();
    console.log("Server process terminated.");
  } else {
    console.log("No server process running.");
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  startExpressServer();
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    stopExpressServer();
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
