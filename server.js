const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let matchmakingQueue = [];

// Serve i file statici dalla cartella "public"
app.use(express.static(path.join(__dirname, 'public')));

// Quando un giocatore si connette
io.on('connection', (socket) => {
  console.log(`Giocatore connesso: ${socket.id}`);

  // Quando un giocatore entra in matchmaking
  socket.on('joinMatchmaking', () => {
    console.log(`Giocatore ${socket.id} entra in matchmaking`);
    matchmakingQueue.push(socket.id);

    // Se c'è già un altro giocatore in coda
    if (matchmakingQueue.length >= 2) {
      const player1 = matchmakingQueue.shift();  // Primo giocatore
      const player2 = matchmakingQueue.shift();  // Secondo giocatore

      // Crea una stanza (room) unica per i due giocatori
      const roomId = `${player1}-${player2}`;
      io.to(player1).emit('matchFound', { roomId, opponentId: player2 });
      io.to(player2).emit('matchFound', { roomId, opponentId: player1 });

      console.log(`Match creato tra ${player1} e ${player2} nella stanza ${roomId}`);
    }
  });

  // Quando un giocatore si disconnette
  socket.on('disconnect', () => {
    console.log(`Giocatore disconnesso: ${socket.id}`);

    // Se il giocatore era in matchmaking, rimuovilo dalla coda
    const index = matchmakingQueue.indexOf(socket.id);
    if (index !== -1) {
      matchmakingQueue.splice(index, 1);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
