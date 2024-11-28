const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;

let connections = 0;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client.html'));
});

app.get('/stream', (req, res) => {
  connections++;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    const data = {
      serverTime: new Date().toLocaleString(),
      connections,
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
    connections--;
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));