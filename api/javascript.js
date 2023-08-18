function handler(runJavaScript, req, res) {
    console.log('execute JavaScript');

    // Handle preflight request (OPTIONS method)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    if (req.method === 'POST') {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ message: 'Code parameter is required.' });
        }

        runJavaScript(code, (log) => {
            console.log(`Command executed successfully. Output: ${log}`); // Log output to console
            return res.status(200).json({ message: 'Command executed with such log:', output: log });
        });
    } else {
        res.status(405).json({ message: 'Method not allowed. Please use POST.' });
    }
}

module.exports = handler;