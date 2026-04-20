const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const bot = require('./bot');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {

  socket.on('start', (word) => {
    bot.startGiveaway(word);
  });

  socket.on('stop', () => {
    bot.stopGiveaway();
  });

  socket.on('pick', () => {
    const winner = bot.pickWinner();

    socket.emit('winner', {
      name: winner,
      stats: {
        messages: bot.messages[winner] || 0,
        plus: bot.plusCount[winner] || 0
      }
    });
  });

  socket.on('getParticipants', () => {
    socket.emit('participants', bot.participants.size);
  });

});

server.listen(3000, () => {
  console.log('Server started');
});