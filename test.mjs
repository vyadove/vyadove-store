// @ts-nocheck

import { createServer } from 'http';

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  const { method, url, headers } = req;
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    // console.log('Method:', method);
    // console.log('URL:', url);
    // console.log('Headers:', headers);
    console.log('Body:', body);
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Received request body!\n');
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
