const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, { debug: true });

app.use('/peerjs', peerServer);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
