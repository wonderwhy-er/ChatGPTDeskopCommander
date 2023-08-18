// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const path = require('path');

const startServer = require('./pluginServer.js');

function levelToName(level) {
  if(level === 0) return 'Log: ';
  if(level === 1) return 'Warning: ';
  if(level === 2) return 'Error: ';
  if(level === 3) return 'Debug: ';
  if(level === 4) return 'Info: ';
  return 'Unknown: ';
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL('https://chat.openai.com/');
  mainWindow.webContents.openDevTools();
  mainWindow.maximize();
  startServer(async (code, callback) => {
    const log = [];
    const handler = (event, level, message, line, sourceId) => {
      log.push(`${levelToName(level)} ${message} (source: ${sourceId}, line: ${line})`);
    }
    mainWindow.webContents.on('console-message', handler);

    try {
      const result = await mainWindow.webContents.executeJavaScript(code);
      log.push('Execution finished with result: ' + result);
    } catch (e) {
      log.push('Execution failed with error: ' + e.message);
    }
    callback(log.join('\n'));
    mainWindow.webContents.removeListener('console-message', handler);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});
