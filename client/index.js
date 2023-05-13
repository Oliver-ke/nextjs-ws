const ws = new WebSocket('ws://localhost:3000');
const chatList = document.querySelector('.chat-list');
const button = document.getElementById('send-btn');
const textIn = document.getElementById('chat-input');

const sendMessage = (msg) => {
  const message = {
    event: 'chat',
    data: msg,
  };
  if (ws.OPEN) {
    ws.send(JSON.stringify(message));
  }
};

const updateList = (msg, isSender) => {
  const newListItem = document.createElement('li');
  newListItem.className = isSender ? 'message' : 'message received';
  const pText = document.createElement('p');
  pText.textContent = `${isSender ? '->' : '<-'} ${msg}`;
  newListItem.appendChild(pText);
  chatList.appendChild(newListItem);
};

button.addEventListener('click', () => {
  const message = textIn.value;
  console.log(message);
  sendMessage(message);
  textIn.value = '';
  updateList(message, true);
});

ws.addEventListener('open', (event) => {
  console.log('new websocket connection');
});

ws.addEventListener('close', (event) => {
  console.log('connection closed');
});

ws.addEventListener('message', (event) => {
  console.log('new message received', event.data);
  const message = JSON.parse(event.data);

  if (message.event === 'chat') {
    console.log('chat message', message.data);
    updateList(message.data, false);
  }
});
