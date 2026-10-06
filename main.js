const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 760,
    title: "Workspace Dashboard",
    backgroundColor: "#0b1020",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadFile("index.html");

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("app:get-info", () => ({
  name: app.name,
  version: app.getVersion(),
  platform: process.platform,
  arch: process.arch,
  isPackaged: app.isPackaged,
  userDataPath: app.getPath("userData")
}));

ipcMain.handle("app:open-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  });

  return result.canceled ? [] : result.filePaths;
});

ipcMain.handle("app:ping", (_event, payload) => ({
  ok: true,
  echo: payload,
  timestamp: Date.now()
}));

ipcMain.handle("app:toggle-theme", (_event, theme) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.send("theme:changed", theme);
  }
  return { theme };
});
