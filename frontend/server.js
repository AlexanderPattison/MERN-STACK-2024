const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '..', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'server.cert'))
};

app.prepare().then(() => {
    createServer(httpsOptions, async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    }).listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on https://localhost:3000');
    });
});