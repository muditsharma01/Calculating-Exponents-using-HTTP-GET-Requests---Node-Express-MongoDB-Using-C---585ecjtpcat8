const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/') {
    const chunks = [];

    req.on('data', chunk => {
      const buf = Buffer.from(chunk);
      const str = buf.toString();
      chunks.push(str);
    });

    req.on('end', () => {
      try {
        const data = chunks.join('');
        const obj = JSON.parse(data);

        const value1 = obj.num1;
        const value2 = obj.num2;

        // Check if num1 is a positive integer
        if (!Number.isInteger(value1) || value1 <= 0) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('The operation cannot be performed. "num1" must be a positive integer.');
          return;
        }

        // Check if num2 is a non-negative integer
        if (!Number.isInteger(value2) || value2 < 0) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('"num2" must be a non-negative integer.');
          return;
        }

        // Calculate the exponential power
        const result = Math.pow(value1, value2);

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`The result is ${result}`);
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON format in the request body.');
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Invalid endpoint. Only POST requests to "/" are accepted.');
  }
});

module.exports = server;
