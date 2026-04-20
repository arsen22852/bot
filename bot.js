const tmi = require('tmi.js');

const client = new tmi.Client({
  identity: {
    username: 'ТВОЙ_БОТ',
    password: 'oauth:ТВОЙ_ТОКЕН'
  },
  channels: ['ТВОЙ_КАНАЛ']
});

let participants = new Set();
let messages = {};
let plusCount = {};

let keyword = "+";
let giveawayActive = false;

client.connect();

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  const user = tags.username;

  // считаем сообщения
  messages[user] = (messages[user] || 0) + 1;

  // если розыгрыш включен
  if (giveawayActive && message.trim() === keyword) {
    participants.add(user);
    plusCount[user] = (plusCount[user] || 0) + 1;
  }
});

// функции
function startGiveaway(word) {
  keyword = word;
  participants.clear();
  giveawayActive = true;
}

function stopGiveaway() {
  giveawayActive = false;
}

function pickWinner() {
  const arr = Array.from(participants);
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  startGiveaway,
  stopGiveaway,
  pickWinner,
  participants,
  messages,
  plusCount
};