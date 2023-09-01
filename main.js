

const { app, BrowserWindow } = require('electron');
const { screen } = require('electron')
const path = require('path');

const startServer = require('./pluginServer.js');
const {registerPluginIfNeeded} = require("./browser-context-scripts/registerChatGPTPluginScript");

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
  let secondWindow;

  function openSecondWindow(url) {
    if (!secondWindow) {
      const {width, height} = screen.getPrimaryDisplay().workAreaSize

      secondWindow = new BrowserWindow({
        x: width / 2,
        y: 0,
        width: width / 2,
        height: height
      });

      mainWindow.setSize(width / 2, height);
      mainWindow.setPosition(0, 0);
    }
    secondWindow.loadURL(url);
    return 'page loading'
  }

  mainWindow.loadURL('https://chat.openai.com/');
  const addScriptOnce = async () => {
    const code = registerPluginIfNeeded.toString() + '\nregisterPluginIfNeeded();';
    console.log('loaded', code);
    const res = await mainWindow.webContents.executeJavaScript(code);
    console.log('plugin registered', res);
    mainWindow.webContents.removeListener('did-finish-load', addScriptOnce);
  };
  mainWindow.webContents.on('did-finish-load', addScriptOnce);
  mainWindow.webContents.openDevTools();
  mainWindow.maximize();
  startServer(async (code, callback, target) => {
    const log = [];
    let window;
    if (target === 'chat') {
      window = mainWindow;
    } else if (target === 'webpage') {
      window = secondWindow;
      if (!window) {
        callback('Error, no web page was opened, open web page first');
      }
    } else {
      callback('Unknown target');
      return;
    }
    const handler = (event, level, message, line, sourceId) => {
      log.push(`${levelToName(level)} ${message} (source: ${sourceId}, line: ${line})`);
    }
    window.webContents.on('console-message', handler);

    try {
      const result = await window.webContents.executeJavaScript(code);
      log.push('Execution finished with result: ' + result);
    } catch (e) {
      console.log(e);
      log.push('Execution failed with error: ' + e.message);
    }
    console.log(log);
    callback(log);
    window.webContents.removeListener('console-message', handler);
  }, openSecondWindow);
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
