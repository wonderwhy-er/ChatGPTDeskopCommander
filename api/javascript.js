const {lastCommand} = require("./lastCommand");

function handler(runJavaScript, req, res) {
    console.log('execute JavaScript');

    // Handle preflight request (OPTIONS method)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    if (req.method === 'POST') {
        const { code, target } = req.body;
        if (!code) {
            return res.status(400).json({ message: 'Code parameter is required.' });
        }

        if (!target) {
            return res.status(400).json({ message: 'Target parameter is required.' });
        }

        console.log('running javascript:' + code);
        runJavaScript(code, (log) => {
            console.log(`Command executed successfully. Output: ${log}`); // Log output to console
            lastCommand.type = 'browser';
            lastCommand.body = req.body;
            return res.status(200).send(JSON.stringify({ message: 'Command executed with such log:', output: log }));
        }, target);
    } else {
        res.status(405).json({ message: 'Method not allowed. Please use POST.' });
    }
}

module.exports = handler;