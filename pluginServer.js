// Express server setup
const express = require('express');
const http = require('http');
const path = require('path');
const {terminalHandler, interruptHandler} = require('./api/terminal');
const webHandler = require('./api/javascript');
const openWebPageHandler = require('./api/openWebpage');
const commandHandler = require('./api/commandHandler');

module.exports = (runCode, openWebpage, port) => {
    const expressApp = express();
    const server = http.createServer(expressApp);
    expressApp.use(express.json());
    expressApp.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'https://chat.openai.com');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Private-Network', 'true');
        res.setHeader('Access-Control-Allow-Headers', '*');

        console.log('request', req.path);
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
    expressApp.post("/api/openWebpage", (req, res, next) => openWebPageHandler(openWebpage, req, res, next));

    const getSentenceVectors = require("./api/sentenceVector.js");

    expressApp.post("/api/getSentenceVectors", async (req, res) => {
        const { text } = req.body;
        if (!text) {
            res.status(400).send({ error: "Text is required." });
            return;
        }

        try {
            const results = await getSentenceVectors(text);
            console.log(results);
            res.status(200).send(results);
        } catch (error) {
            res.status(500).send({ error: "Failed to process the request." });
        }
    });

    // Add the new route for the interrupt endpoint
    expressApp.post("/api/interrupt", interruptHandler);

    expressApp.use(express.static(path.join(__dirname, 'public')));

    server.listen(port || 3000, () => {
        console.log('Server running on http://localhost:3000');
    });
    return server;
};



