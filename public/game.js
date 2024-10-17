const socket = io('https://u-card-game.vercel.app');

// Funzione per inviare una mossa al server
function playCard(cardId) {
  socket.emit('playCard', { cardId: cardId });
}

// Ascolta per le mosse dagli altri giocatori
socket.on('cardPlayed', (data) => {
  console.log(`Il giocatore ${data.playerId} ha giocato la carta ${data.cardId}`);
  // Aggiorna l'interfaccia con la nuova mossa
});
