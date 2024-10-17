const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve i file statici dalla cartella "public"
app.use(express.static(path.join(__dirname, 'public')));

// Gestisci le connessioni dei giocatori
io.on('connection', (socket) => {
  console.log(`Giocatore connesso: ${socket.id}`);

  // Quando un giocatore gioca una carta
  socket.on('playCard', (data) => {
    console.log(`Carta giocata: ${data.cardId} dal giocatore ${socket.id}`);

    // Invia la mossa a tutti gli altri giocatori
    socket.broadcast.emit('cardPlayed', { 
      cardId: data.cardId, 
      playerId: socket.id 
    });
  });

  // Quando un giocatore si disconnette
  socket.on('disconnect', () => {
    console.log(`Giocatore disconnesso: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
