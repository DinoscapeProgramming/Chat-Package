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
  messageLimit: 200, // Limit of characters of a message
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
    roomNameLimit: 300 // other options you can use to overwrite the options of the class
  }).create(socket.id, options, { messageLimit: 100 } // this options can overwrite the other options);
});
```

### Edit Room
```js
socket.on("editRoom", (options) => {
  Chat.rooms({
    roomNameLimit: 300 // other options you can use to overwrite the options of the class
  }).edit(socket.id, options, { messageLimit: 100 } // this options can overwrite the other options);
});
```

### Delete Room
```js
socket.on("deleteRoom", (options) => {
  Chat.rooms({
    // other options you can use to overwrite the options of the class, in but there are not 
  }).delete(socket.id, options, { messageLimit: 100 } // this options can overwrite the other options);
});
```

### Get Room
```js
socket.on("getRoom", (options) => {
  Chat.rooms({
    messageLimit: 300 // other options you can use to overwrite the options of the class
  }).get(socket.id, options, { messageLimit: 100 } // this options can overwrite the other options);
});
```

