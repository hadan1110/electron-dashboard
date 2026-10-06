const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dashboardAPI", {
  getInfo: () => ipcRenderer.invoke("app:get-info"),
  openFolder: () => ipcRenderer.invoke("app:open-folder"),
  ping: (payload) => ipcRenderer.invoke("app:ping", payload),
  toggleTheme: (theme) => ipcRenderer.invoke("app:toggle-theme", theme),
  onThemeChanged: (callback) => ipcRenderer.on("theme:changed", (_event, theme) => callback(theme))
});
