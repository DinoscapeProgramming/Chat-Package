# Chat Package
A package you can use to create a Chat with express and socket.io

## Class Documentation
### Setup
```js
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const socket.io-chat = require('socket.io-chat');
const Chat = new socket.io-chat.Chat({
  messageLimit: 200, // Limit of characters of a message
});

io.on('connection', (socket, name) => {});
```

### Default options
#### Message Limit
Unlimited

### Create Room
```js
socket.on("createRoom", (options) => {
  Chat.rooms().create(options);
});
```
