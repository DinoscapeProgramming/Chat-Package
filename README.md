# Chat Package
A package you can use to create a Chat with express and socket.io

## Class Documentation
### Setup
```js
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const socketChat = require('socket.io-chat');
const Chat = new socketChat.Chat(app, {
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

### All Rooms
```js
socket.on("allRooms", (options) => {
  Chat.rooms({
    // other options you can use to overwrite the options of the class, but there are currently no
  }).all(socket.id, options, { // this options can overwrite the other options, but there are currently no });
});
```

### Send Message
```js
socket.on("sendMessage", (options) => {
  Chat.messages({
    messageCharacterLimit: 20 // other options you can use to overwrite the options of the class
  }).send(socket.id, options, { messageCharacterLimit: 15 // this options can overwrite the other options });
});
```

### Edit Message
```js
socket.on("editMessage", (options) => {
  Chat.messages({
    messageCharacterLimit: 20 // other options you can use to overwrite the options of the class
  }).edit(socket.id, options, { messageCharacterLimit: 15 // this options can overwrite the other options });
});
```

### Delete Message
```js
socket.on("deleteMessage", (options) => {
  Chat.messages({
    // other options you can use to overwrite the options of the class, but there are currently no
  }).delete(socket.id, options, { // this options can overwrite the other options, but there are currently no });
});
```

### Get Message
```js
socket.on("getMessage", (options) => {
  Chat.messages({
    // other options you can use to overwrite the options of the class, but there are currently no
  }).get(socket.id, options, { // this options can overwrite the other options, but there are currently no });
});
```

### Create User
```js
socket.on("createUser", (options) => {
  Chat.users({
    usernameCharacterLimit: 15 // other options you can use to overwrite the options of the class
  }).create(socket.id, options, { usernameCharacterLimit: 25 } // this options can overwrite the other options);
});
```

### Edit User
```js
socket.on("editUser", (options) => {
  Chat.users({
    usernameCharacterLimit: 15 // other options you can use to overwrite the options of the class
  }).edit(socket.id, options, { usernameCharacterLimit: 25 } // this options can overwrite the other options);
});
```

### Delete User
```js
socket.on("deleteUser", (options) => {
  Chat.users({
    // other options you can use to overwrite the options of the class, but there are currently no 
  }).delete(socket.id, options, { // this options can overwrite the other options, but there are currently no  });
});
```

### Get User
```js
socket.on("getUser", (options) => {
  Chat.users({
    // other options you can use to overwrite the options of the class, but there are currently no
  }).get(socket.id, options, { // this options can overwrite the other options, but there are currently no });
});
```

## HTML Client Side Documentation
### Setup
```html
<script src="/socket.io-chat/socket.io-chat.js">
```

### Configuration
```js
const socket = io();
const chat new Chat(socket);
```

### Create Room
```js
Chat.rooms().create(options);
```

### Edit Room
```js
Chat.rooms().edit(options);
```

### Delete Room
```js
Chat.rooms().delete(options);
```

### Get Room
```js
Chat.rooms().get(options);
```

### All Rooms
```js
Chat.rooms().all();
```

### Send Message
```js
Chat.messages().send(options);
```

### Edit Message
```js
Chat.messages().edit(options);
```

### Delete Message
```js
Chat.messages().delete(options);
```

### Get Message
```js
Chat.messages().get(options);
```

### Create User
```js
Chat.users().create(options);
```

### Edit User
```js
Chat.users().edit(options);
```

### Delete User
```js
Chat.users().delete(options);
```

### Get User
```js
Chat.users().get(options);
```

## Functions
```js
[
  isURL,
  configRooms,
  createRoom,
  editRoom,
  deleteRoom,
  getRoom,
  allRooms,
  joinRoom,
  leaveRoom,
  sendMessage,
  editMessage,
  deleteMessage,
  getMessage,
  createUser,
  editUser,
  deleteUser,
  getUser,
  isURLSync,
  configRoomsSync,
  createRoomSync,
  editRoomSync,
  deleteRoomSync,
  getRoomSync,
  allRoomsSync,
  joinRoomSync,
  leaveRoomSync,
  sendMessageSync,
  editMessageSync,
  deleteMessageSync,
  getMessageSync,
  createUserSync,
  editUserSync,
  deleteUserSync,
  getUserSync
]
```

## Classes
```js
[
  Chat,
  RoomManager,
  MessageManager,
  UserManager,
  UtilManager,
  FunctionManager
]
```

## Types
```json
{
  "Types": {
    "Managers": {
      "Rooms": "rooms",
      "Messages": "messages",
      "Users": "users",
      "Util": "util",
      "Functions": "functions"
    }
  }
}
```
