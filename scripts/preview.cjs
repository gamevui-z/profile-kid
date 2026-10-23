const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const html = path.join(__dirname, '..', 'index.html');
const port = Number(process.env.PORT || 4173);
http.createServer((request, response) => {
    const route = request.url.split('?')[0];
    if (route === '/kid') { response.writeHead(301, { Location: '/kid/' }).end(); return; }
    const file = route === '/kid/' || route === '/kid/index.html' ? path.join(__dirname, '..', 'kid', 'index.html') : html;
    if (!['/', '/index.html', '/kid/', '/kid/index.html'].includes(route)) {
        response.writeHead(404).end('Not found');
        return;
    }
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(fs.readFileSync(file));
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));

