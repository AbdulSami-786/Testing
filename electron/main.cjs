// Electron shell for the dashboard.
//
// The web build (dist/) is loaded straight from disk. The app uses HashRouter
// and a relative asset base, so it needs no local server. Its data lives in the
// Google Sheet through the Apps Script URL in src/lib/config.js, so the desktop
// program and the website share the same data and users.

const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('node:path');

// A second launch focuses the existing window instead of opening another.
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    backgroundColor: '#111318',
    title: 'EWD Dashboard',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));

  // Print / "Export PDF" opens a blank window and writes the document into it
  // (printHTML in src/lib/exporters.js), so about:blank windows must be allowed.
  // Real web links open in the user's browser instead.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return {
      action: 'allow',
      overrideBrowserWindowOptions: { autoHideMenuBar: true, width: 900, height: 700 },
    };
  });

  win.on('closed', () => { win = null; });
}

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
