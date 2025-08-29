const { app, BrowserWindow, ipcMain, dialog, globalShortcut, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let previewWindow;

const stateFile = path.join(app.getPath('userData'), 'window-state.json');

function restoreWindowState() {
  try {
    return JSON.parse(fs.readFileSync(stateFile));
  } catch {
    return { width: 800, height: 600 };
  }
}

function saveWindowState(bounds) {
  fs.writeFileSync(stateFile, JSON.stringify(bounds));
}

function createMainWindow() {
  const state = restoreWindowState();

  mainWindow = new BrowserWindow({
    width: state.width,
    height: state.height,
    x: state.x,
    y: state.y,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('close', () => {
    saveWindowState(mainWindow.getBounds());
  });

  mainWindow.on("resize", () => {
    mainWindow.webContents.send("window-state-updated", mainWindow.getBounds());
  });

  globalShortcut.register('Control+Shift+P', () => {
    if (previewWindow) {
      previewWindow.close();
      previewWindow = null;
    } else {
      previewWindow = new BrowserWindow({
        width: 200,
        height: 200,
        alwaysOnTop: true,
        frame: false,
        parent: mainWindow,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
      });
      previewWindow.loadFile('about.html'); 
    }
  });

  registerShortcuts();
}

function registerShortcuts() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  globalShortcut.register("Control+Alt+Left", () => {
    mainWindow.setBounds({ x: 0, y: 0, width: Math.floor(width / 2), height });
  });

  globalShortcut.register("Control+Alt+Right", () => {
    mainWindow.setBounds({ x: Math.floor(width / 2), y: 0, width: Math.floor(width / 2), height });
  });

  globalShortcut.register("Control+Alt+Up", () => {
    const newWidth = Math.floor(width * 0.66);
    const newHeight = Math.floor(height * 0.66);
    mainWindow.setBounds({
      x: Math.floor((width - newWidth) / 2),
      y: Math.floor((height - newHeight) / 2),
      width: newWidth,
      height: newHeight
    });
  });
}

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

ipcMain.on('windowControls:minimize', () => mainWindow.minimize());
ipcMain.on('windowControls:maximizeRestore', () => {
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
ipcMain.on('windowControls:close', () => mainWindow.close());

ipcMain.handle('windowControls:openImage', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
    properties: ['openFile']
  });

  if (canceled) return null;

  const filePath = filePaths[0];
  const stats = fs.statSync(filePath);
  const data = fs.readFileSync(filePath);
  const base64 = `data:image/${path.extname(filePath).slice(1)};base64,${data.toString('base64')}`;

  const image = {
    path: filePath,
    name: path.basename(filePath),
    size: stats.size,
    base64
  };

  return image;
});

ipcMain.on("send-to-preview", (_event, image) => {
  if (previewWindow) {
    previewWindow.webContents.send("preview-image", image);
  }
});
