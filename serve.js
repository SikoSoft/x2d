const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('./config.json').server;
const http = require('http');

process.title = 'rougex-server';

// Web Server

const router = express.Router();
const app = express();

app.use(express.static(path.join(__dirname, '/public')));

router.get('/config.json', (req, res) => {
  fs.readFile('./config.json', (error, data) => {
    res.send(data);
  });
});
app.use(router);

app.listen(config.webPort, function() {
  // eslint-disable-next-line
  console.log(`Web server listening on port ${config.webPort}`);
});
