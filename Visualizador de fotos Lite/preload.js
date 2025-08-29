const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('windowControls:minimize'),
  maximizeRestore: () => ipcRenderer.send('windowControls:maximizeRestore'),
  close: () => ipcRenderer.send('windowControls:close'),
  openImage: () => ipcRenderer.invoke('windowControls:openImage'),
  sendToPreview: (image) => ipcRenderer.send("send-to-preview", image),
  onWindowStateUpdate: (callback) => ipcRenderer.on("window-state-updated", callback),
  onPreviewImage: (callback) => ipcRenderer.on("preview-image", (_event, image) => callback(image))
});
