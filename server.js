const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Definisci la tua rotta per i file statici
app.use(express.static('client'));

// Setup socket.io
io.on('connection', (socket) => {
  console.log('Nuovo client connesso');
  socket.on('disconnect', () => {
    console.log('Client disconnesso');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server in ascolto sulla porta ${PORT}`));
