// Express server setup
const express = require('express');
const http = require('http');
const path = require('path');
const terminalHandler = require('./api/terminal');
const webHandler = require('./api/javascript');
const commandHandler = require('./api/commandHandler');

module.exports = (runCode) => {
    const expressApp = express();
    const server = http.createServer(expressApp);
    expressApp.use(express.json());
    expressApp.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'https://chat.openai.com');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Private-Network', 'true');
        res.setHeader('Access-Control-Allow-Headers', '*');

        console.log();
        next();
    });

    expressApp.get('/', (req, res) => {
        res.send('Hello World');
    });

    expressApp.options('*', (req, res) => {
        res.status(200).send();
    });
    expressApp.post('/api/runTerminalScript', terminalHandler);
    expressApp.post('/api/executeJavaScript', (req, res, next) => webHandler(runCode, req, res, next));
    expressApp.post("/api/saveCommand", commandHandler.save);
    expressApp.get("/api/listCommands", commandHandler.list);
    expressApp.post("/api/runSavedCommand", (req, res, next) => commandHandler.run(runCode, req, res, next));
    expressApp.get("/api/printCommand/:id", commandHandler.print);
    expressApp.put("/api/updateCommand/:id", commandHandler.update);
    expressApp.delete("/api/removeCommand/:id", commandHandler.remove);

    expressApp.use(express.static(path.join(__dirname, 'public')));

    server.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
    return server;
};
