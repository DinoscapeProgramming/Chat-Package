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
  file: "./chat.json"
} // options that always will be the same, {
  messageCharacterLimit: 200, // Limit of characters of a message
  roomNameCharacterLimit: 30, // Limit of characters of a room name
  usernameCharacterLimit: 20, // Limit of characters of a username
} // options that can be defined and overwrited for each single request);

io.on('connection', (socket, name) => {});
```

### Default options
#### Message Limit
Unlimited

### Create Room
```js
socket.on("createRoom", (options) => {
  Chat.rooms({
    roomNameCharacterLimit: 50 // other options you can use to overwrite the options of the class
  }).create(socket.id, options, { roomNameCharacterLimit: 40 } // this options can overwrite the other options);
});
```

### Edit Room
```js
socket.on("editRoom", (options) => {
  Chat.rooms({
    roomNameCharacterLimit: 50 // other options you can use to overwrite the options of the class
  }).edit(socket.id, options, { roomNameCharacterLimit: 40 } // this options can overwrite the other options);
});
```

### Delete Room
```js
socket.on("deleteRoom", (options) => {
  Chat.rooms({
    // other options you can use to overwrite the options of the class, but there are currently no 
  }).delete(socket.id, options, { // this options can overwrite the other options, but there are currently no  });
});
```

### Get Room
```js
socket.on("getRoom", (options) => {
  Chat.rooms({
    // other options you can use to overwrite the options of the class, but there are currently no
  }).get(socket.id, options, { // this options can overwrite the other options, but there are currently no });
});
```

### Send Message
```js
socket.on("sendMessage", (options) => {
  Chat.rooms({
    messageCharacterLimit: 20 // other options you can use to overwrite the options of the class
  }).send(socket.id, options, { messageCharacterLimit: 15 // this options can overwrite the other options });
});
```

### Delete Message
```js
socket.on("deleteMessage", (options) => {
  Chat.rooms({
    // other options you can use to overwrite the options of the class, but there are currently no
  }).delete(socket.id, options, { // this options can overwrite the other options, but there are currently no });
});
```
