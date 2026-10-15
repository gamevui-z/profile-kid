const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const html = path.join(__dirname, '..', 'index.html');
const port = Number(process.env.PORT || 4173);
http.createServer((request, response) => {
    if (request.url !== '/' && request.url !== '/index.html') {
        response.writeHead(404).end('Not found');
        return;
    }
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(fs.readFileSync(html));
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));

