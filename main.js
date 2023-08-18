// Modules to control application life and create native browser window
const terminalHandler = require("./api/terminal");

const { app, BrowserWindow } = require('electron')
const path = require('path')
const express = require('express');
const http = require('http');

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  mainWindow.loadURL('https://chat.openai.com/');
  mainWindow.webContents.openDevTools();
  mainWindow.maximize();
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Set up Express server
const expressApp = express();
const server = http.createServer(expressApp);
expressApp.use(express.json());
expressApp.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://chat.openai.com');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  res.setHeader('Access-Control-Allow-Headers', '*'); // Add allowed headers

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

expressApp.get('/', (req, res) => {
  res.send('Hello World');
});

expressApp.options('*', (req, res) => {
  res.status(200).send();
});
expressApp.post('/api/executeCommand', terminalHandler);

expressApp.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});