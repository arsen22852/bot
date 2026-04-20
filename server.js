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

  const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

server.listen(3000, () => {
  console.log('Server started');
});
