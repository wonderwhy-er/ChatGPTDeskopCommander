const { exec } = require('child_process');

function handler(req, res) {
    console.log('execute command');
    res.setHeader('Access-Control-Allow-Origin', 'https://chat.openai.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, openai-conversation-id, openai-ephemeral-user-id');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Handle preflight request (OPTIONS method)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    if (req.method === 'POST') {
        const { command } = req.body;
        if (!command) {
            return res.status(400).json({ message: 'Command parameter is required.' });
        }

        exec(`${command}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`); // Log error to console
                return res.status(500).json({ message: `Error executing command: ${error.message}` });
            }
            console.log(`Command executed successfully. Output: ${stdout || stderr}`); // Log output to console
            return res.status(200).json({ message: 'Command executed successfully.', output: stdout || stderr });
        });
    } else {
        res.status(405).json({ message: 'Method not allowed. Please use POST.' });
    }
}

module.exports = handler;