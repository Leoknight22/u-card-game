const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve i file statici dalla cartella "public"
app.use(express.static(path.join(__dirname, 'public')));

// Array per tenere traccia dei giocatori in attesa
let waitingPlayers = [];

// Gestisci le connessioni dei socket
io.on('connection', (socket) => {
    console.log(`Giocatore connesso: ${socket.id}`);

    // Aggiungi il giocatore alla lista in attesa per il matchmaking
    waitingPlayers.push(socket);

    // Prova a fare il matchmaking
    if (waitingPlayers.length >= 2) {
        const player1 = waitingPlayers.shift(); // Prendi il primo giocatore
        const player2 = waitingPlayers.shift(); // Prendi il secondo giocatore

        // Crea una sala per i due giocatori
        const roomId = `${player1.id}-${player2.id}`;
        player1.join(roomId);
        player2.join(roomId);

        // Informa i giocatori che sono stati messi in coppia
        player1.emit('match_found', { opponentId: player2.id });
        player2.emit('match_found', { opponentId: player1.id });

        console.log(`Giocatori abbinati in sala: ${roomId}`);
    }

    // Gestisci la disconnessione del giocatore
    socket.on('disconnect', () => {
        console.log(`Giocatore disconnesso: ${socket.id}`);
        // Rimuovi il giocatore dalla lista di attesa
        waitingPlayers = waitingPlayers.filter(player => player !== socket);
    });
});

// Avvia il server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
