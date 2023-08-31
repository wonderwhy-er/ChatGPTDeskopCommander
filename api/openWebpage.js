function handler(openWebpage, req, res) {
    console.log('open webpage');

    // Handle preflight request (OPTIONS method)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    if (req.method === 'POST') {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ message: 'url parameter is required.' });
        }

        openWebpage(url);
        return res.status(200).send(JSON.stringify({ message: 'Page is loading' }));
    } else {
        res.status(405).json({ message: 'Method not allowed. Please use POST.' });
    }
}

module.exports = handler;