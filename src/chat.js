/*
TODO: Synchronous versions of each function
FIXME: lol
*/

const fs = require('fs');
const crypto = require('crypto');
const { defaultFunction } = require("./example.js");
const { resolve } = require('path');

function readFileSync() {
  try {
    return JSON.parse(fs.readFileSync(module.exports.options.file, 'utf8'));
  } catch (err) {
    return { action: "readFileSync", err: err.message };
  }
}

function isURL(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "isURL", err: "No options were given" });
    if (!Object.keys(options).includes("url") || !options.url) return resolve({ action: "isURL", err: "No url was given" });
    try {
      new URL(options.url);
    } catch (err) {
      return resolve({ action: "isURL", result: false });
    }
    return resolve({ action: "isURL", result: true });
  });
}

function isURLSync(options) {
  if (!options || Object.keys(options).length === 0) return { action: "isURLSync", err: "No options were given" };
  if (!Object.keys(options).includes("url") || !options.url) return { action: "isURLSync", err: "No url was given" };
  try {
    new URL(options.url);
  } catch (err) {
    return { action: "isURLSync", result: false };
  }
  return { action: "isURLSync", result: true };
}

function configRooms(app, options) {
  return new Promise((resolve, reject) => {
    if (!options || typeof options !== "object") return resolve({ action: "configRooms", err: "Invalid options" });
    app.all("/socket.io-chat/socket.io-chat.js", (req, res) => {
      res.sendFile("/src/file.js", "utf8", { root: __dirname });
    });
    module.exports = {
      options
    }
    return resolve({ action: "configRooms", options });
  });
}

function configRoomsSync(app, options) {
  if (!options || typeof options !== "object") return { action: "configRoomsSync", err: "Invalid options" };
  app.all("/socket.io-chat/socket.io-chat.js", (req, res) => {
    res.sendFile("/src/file.js", "utf8", { root: __dirname });
  });
  module.exports = {
    options
  }
  return { action: "configRoomsSync", options };
}

function createRoom(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "createRoom", err: "No options were given" });
    if (!Object.keys(options).includes("name") || !options.name) return resolve({ action: "createRoom", err: "No name was given" });
    if (!userId) return resolve({ action: "createRoom", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "createRoom", err: "Invalid user id" });
    if ((extraOptions?.roomNameCharacterLimit) && (options.name.length > extraOptions.roomNameCharacterLimit)) return resolve({ action: "createRoom", err: "Name is too long" });
    if (options?.privat === true) {
      crypto.randomBytes(10, function (err, token) {
        if (err) return resolve({ action: "createRoom", err: err.message });
        crypto.randomBytes(4, function (err, id) {
          if (err) return resolve({ action: "createRoom", err: err.message });
          fs.writeFile(module.exports.options.file, JSON.stringify({
            users: readFileSync().users,
            rooms: {
              ...readFileSync().rooms,
              ...{
                [id.toString('hex')]: {
                  name: options.name,
                  privat: false,
                  users: {
                    [userId]: {
                      username: readFileSync().users[userId].username
                    }
                  },
                  messages: []
                }
              }
            }
          }), 'utf8', function (err) {
            if (err) return resolve({ action: "createRoom", err: err.message });
            return resolve({ action: "createRoom", userId, id: id.toString('hex'), token: token.toString('hex'), name: options.name, privat: true });
          });
        });
      });
    } else {
      crypto.randomBytes(4, function (err, id) {
        if (err) return resolve({ action: "createRoom", err: err.message });
        fs.writeFile(module.exports.options.file, JSON.stringify({
          users: readFileSync().users,
          rooms: {
            ...readFileSync().rooms,
            ...{
              [id.toString('hex')]: {
                name: options.name,
                privat: false,
                users: {
                  [userId]: {
                    username: readFileSync().users[userId].username
                  }
                },
                messages: []
              }
            }
          }
        }), 'utf8', function (err) {
          if (err) return resolve({ action: "createRoom", err: err.message });
          return resolve({ action: "createRoom", userId, id: id.toString('hex'), name: options.name, privat: false });
        });
      });
    }
  });
}

function createRoomSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "createRoomSync", err: "No options were given" };
  if (!Object.keys(options).includes("name") || !options.name) return { action: "createRoomSync", err: "No name was given" };
  if (!userId) return { action: "createRoomSync", err: "No user id was given" };
  if (!Object.keys(readFileSync().users).includes(userId)) return { action: "createRoomSync", err: "Invalid user id" };
  if ((extraOptions?.roomNameCharacterLimit) && (options.name.length > extraOptions.roomNameCharacterLimit)) return { action: "createRoomSync", err: "Name is too long" };
  if (options?.privat === true) {
    try {
      var token = crypto.randomBytes(10);
      var id = crypto.randomBytes(4);
      fs.writeFileSync(module.exports.options.file, JSON.stringify({
        users: readFileSync().users,
        rooms: {
          ...readFileSync().rooms,
          ...{
            [id.toString('hex')]: {
              name: options.name,
              privat: false,
              token: token.toString("hex"),
              users: {
                [userId]: {
                  username: readFileSync().users[userId].username
                }
              },
              messages: []
            }
          }
        }
      }), 'utf8');
    } catch (err) {
      return { action: "createRoomSync", err: err.message };
    }
    return { action: "createRoomSync", userId, id: id.toString('hex'), token: token.toString('hex'), name: options.name, privat: true };
  } else {
    try {
      var id = crypto.randomBytes(4);
      fs.writeFile(module.exports.options.file, JSON.stringify({
        users: readFileSync().users,
        rooms: {
          ...readFileSync().rooms,
          ...{
            [id.toString('hex')]: {
              name: options.name,
              privat: false,
              users: {
                [userId]: {
                  username: readFileSync().users[userId].username
                }
              },
              messages: []
            }
          }
        }
      }), 'utf8');
    } catch (err) {
      return { action: "createRoomSync", err: err.message };
    }
    return { action: "createRoomSync", userId, id: id.toString('hex'), name: options.name, privat: false };
  }
}

function editRoom(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "editRoom", err: "No options were given" });
    if (!Object.keys(options).includes("id") || !options.id) return resolve({ action: "editRoom", err: "No id was given" });
    if (!Object.keys(options).includes("options") || !options.options) return resolve({ action: "editRoom", err: "No new options were given" });
    if (!Object.keys(readFileSync().rooms).includes(options.id)) return resolve({ action: "editRoom", err: "Id does not exist" });
    if (!userId) return resolve({ action: "editRoom", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "editRoom", err: "Invalid user id" });
    if (Object.keys(readFileSync().rooms[options.id].users)[0] !== userId) return resolve({ action: "editRoom", err: "You are not the creator of this room" });
    var buffer = readFileSync().rooms;
    if (options.options.name) {
      if ((extraOptions?.roomNameCharacterLimit) && (options.options.name.length > extraOptions.roomNameCharacterLimit)) return resolve({ action: "editRoom", err: "Name is too long" });
      buffer[options.id].name = options.options.name;
    }
    if (options.options.icon) {
      if (!isURLSync({ url: options.options.icon })) return resolve({ action: "editRoom", err: "Icon is not a valid url" });
      buffer[options.id].icon = options.options.icon;
    }
    fs.writeFile(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8', function (err) {
      if (err) return resolve({ action: "editRoom", err: err.message });
      return resolve({ action: "editRoom", userId, id: options.id, options: options.options });
    });
  });
}

function editRoomSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "editRoomSync", err: "No options were given" };
  if (!Object.keys(options).includes("id") || !options.id) return { action: "editRoomSync", err: "No id was given" };
  if (!Object.keys(options).includes("options") || !options.options) return { action: "editRoomSync", err: "No new options were given" };
  if (!Object.keys(readFileSync().rooms).includes(options.id)) return { action: "editRoomSync", err: "Id does not exist" };
  if (!userId) return { action: "editRoomSync", err: "No user id was given" };
  if (!Object.keys(readFileSync().users).includes(userId)) return { action: "editRoomSync", err: "Invalid user id" };
  if (Object.keys(readFileSync().rooms[options.id].users)[0] !== userId) return { action: "editRoomSync", err: "You are not the creator of this room" };
  var buffer = readFileSync().rooms;
  if (options.options.name) {
    if ((extraOptions?.roomNameCharacterLimit) && (options.options.name.length > extraOptions.roomNameCharacterLimit)) return { action: "editRoomSync", err: "Name is too long" };
    buffer[options.id].name = options.options.name;
  }
  if (options.options.icon) {
    if (!isURLSync({ url: options.options.icon })) return { action: "editRoomSync", err: "Icon is not a valid url" };
    buffer[options.id].icon = options.options.icon;
  }
  try {
  fs.writeFileSync(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8');
  } catch (err) {
    return { action: "editRoomSync", err: err.message };
  }
  return resolve({ action: "editRoomSync", userId, id: options.id, options: options.options });
}

function deleteRoom(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "deleteRoom", err: "No options were given" });
    if (!Object.keys(options).includes("id") || !options.id) return resolve({ action: "deleteRoom", err: "No id was given" });
    if (!Object.keys(readFileSync().rooms).includes(options.id)) return resolve({ action: "deleteRoom", err: "Id does not exist" });
    if (!userId) return resolve({ action: "deleteRoom", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "deleteRoom", err: "Invalid user id" });
    if (Object.keys(readFileSync().rooms[options.id].users)[0] !== userId) return resolve({ action: "deleteRoom", err: "You are not the creator of this room" });
    var buffer = readFileSync().rooms;
    delete buffer[options.id];
    fs.writeFile(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8', function (err) {
      if (err) return resolve({ action: "deleteRoom", err: err.message });
      return resolve({ action: "deleteRoom", userId, id: options.id });
    });
  });
}

function deleteRoomSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "deleteRoomSync", err: "No options were given" };
  if (!Object.keys(options).includes("id") || !options.id) return { action: "deleteRoomSync", err: "No id was given" };
  if (!Object.keys(readFileSync().rooms).includes(options.id)) return { action: "deleteRoomSync", err: "Id does not exist" };
  if (!userId) return { action: "deleteRoomSync", err: "No user id was given" };
  if (!Object.keys(readFileSync().users).includes(userId)) return { action: "deleteRoomSync", err: "Invalid user id" };
  if (Object.keys(readFileSync().rooms[options.id].users)[0] !== userId) return { action: "deleteRoomSync", err: "You are not the creator of this room" };
  var buffer = readFileSync().rooms;
  delete buffer[options.id];
  try {
    fs.writeFileSync(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8');
  } catch (err) {
    return { action: "deleteRoomSync", err: err.message };
  }
  return { action: "deleteRoomSync", userId, id: options.id };
}

function getRoom(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "getRoom", err: "No options were given" });
    if (!Object.keys(options).includes("id") || !options.id) return resolve({ action: "getRoom", err: "No id was given" });
    if (!Object.keys(readFileSync().rooms).includes(options.id)) return resolve({ action: "getRoom", err: "Id does not exist" });
    var data = {};
    if (options.request.includes("name")) {
      data.name = readFileSync().rooms[options.id].name;
    }
    if (options.request.includes("icon")) {
      data.icon = readFileSync().rooms[options.id].icon;
    }
    if (options.request.includes("messages")) {
      if (readFileSync().rooms[options.id].privat === true && (!Object.keys(options).includes("token") || !options.token)) return resolve({ action: "getRoom", err: "No token was given" });
      if (readFileSync().rooms[options.id].privat === true && (readFileSync().rooms[options.id].token !== options.token)) return resolve({ action: "getRoom", err: "Invalid token" });
      data.messages = readFileSync().rooms[options.id].messages;
    }
    return resolve({ action: "getRoom", userId, id: options.id, data });
  });
}

function getRoomSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "getRoomSync", err: "No options were given" };
  if (!Object.keys(options).includes("id") || !options.id) return { action: "getRoomSync", err: "No id was given" };
  if (!Object.keys(readFileSync().rooms).includes(options.id)) return { action: "getRoomSync", err: "Id does not exist" };
  var data = {};
  if (options.request.includes("name")) {
    data.name = readFileSync().rooms[options.id].name;
  }
  if (options.request.includes("icon")) {
    data.icon = readFileSync().rooms[options.id].icon;
  }
  if (options.request.includes("messages")) {
    if (readFileSync().rooms[options.id].privat === true && (!Object.keys(options).includes("token") || !options.token)) return { action: "getRoom", err: "No token was given" };
    if (readFileSync().rooms[options.id].privat === true && (readFileSync().rooms[options.id].token !== options.token)) return { action: "getRoom", err: "Invalid token" };
    data.messages = readFileSync().rooms[options.id].messages;
  }
  return { action: "getRoomSync", userId, id: options.id, data };
}

function allRooms(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!userId) return resolve({ action: "allRooms", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "allRooms", err: "Invalid user id" });
    if (Object.keys(options).includes("items") && options.items && (typeof options.item === "number")) {
      return resolve({ action: "allRooms", userId, rooms: Object.entries(readFileSync().rooms).filter((item) => item[1].privat === false).map((item) => ({ id: item[0], name: item[1].name })).slice(0, options.items) });
    } else {
      return resolve({ action: "allRooms", userId, rooms: Object.entries(readFileSync().rooms).filter((item) => item[1].privat === false).map((item) => ({ id: item[0], name: item[1].name })) });
    }
  });
}

function allRoomsSync(userId, options, extraOptions) {
  if (!userId) return resolve({ action: "allRoomsSync", err: "No user id was given" });
  if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "allRoomsSync", err: "Invalid user id" });
  if (Object.keys(options).includes("items") && options.items && (typeof options.item === "number")) {
    return { action: "allRoomsSync", userId, rooms: Object.entries(readFileSync().rooms).filter((item) => item[1].privat === false).map((item) => ({ id: item[0], name: item[1].name })).slice(0, options.items) };
  } else {
    return { action: "allRoomsSync", userId, rooms: Object.entries(readFileSync().rooms).filter((item) => item[1].privat === false).map((item) => ({ id: item[0], name: item[1].name })) };
  }
}

function joinRoom(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "joinRoom", err: "No options were given" });
    if (!Object.keys(options).includes("id") || !options.id) return resolve({ action: "joinRoom", err: "No id was given" });
    if (!Object.keys(readFileSync().rooms).includes(options.id)) return resolve({ action: "joinRoom", err: "Id does not exist" });
    if (!userId) return resolve({ action: "joinRoom", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "joinRoom", err: "Invalid user id" });
    if (readFileSync().rooms[options.id].privat === true && (!Object.keys(options).includes("token") || !options.token)) return resolve({ action: "joinRoom", err: "No token was given" });
    if (readFileSync().rooms[options.id].privat === true && (readFileSync().rooms[options.id].token !== options.token)) return resolve({ action: "joinRoom", err: "Invalid token" });
    var buffer = readFileSync().rooms;
    buffer[options.id].users[userId] = {
      username: readFileSync().users[userId].username
    };
    fs.writeFile(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8', function (err) {
      if (err) return resolve({ action: "joinRoom", err: err.message });
      return resolve({ actiom: "joinRoom", userId, id: options.id, username: readFileSync().users[userId].username });
    });
  });
}

function joinRoomSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "joinRoomSync", err: "No options were given" };
  if (!Object.keys(options).includes("id") || !options.id) return { action: "joinRoomSync", err: "No id was given" };
  if (!Object.keys(readFileSync().rooms).includes(options.id)) return { action: "joinRoomSync", err: "Id does not exist" };
  if (!userId) return { action: "joinRoomSync", err: "No user id was given" };
  if (!Object.keys(readFileSync().users).includes(userId)) return { action: "joinRoomSync", err: "Invalid user id" };
  if (readFileSync().rooms[options.id].privat === true && (!Object.keys(options).includes("token") || !options.token)) return { action: "joinRoomSync", err: "No token was given" };
  if (readFileSync().rooms[options.id].privat === true && (readFileSync().rooms[options.id].token !== options.token)) return { action: "joinRoomSync", err: "Invalid token" };
  var buffer = readFileSync().rooms;
  buffer[options.id].users[userId] = {
    username: readFileSync().users[userId].username
  };
  try {
    fs.writeFileSync(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8');
  } catch (err) {
    return { action: "joinRoomSync", err: err.message };
  }
  return { actiom: "joinRoomSync", userId, id: options.id, username: readFileSync().users[userId].username };
}

function leaveRoom(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "leaveRoom", err: "No options were given" });
    if (!Object.keys(options).includes("id") || !options.id) return resolve({ action: "leaveRoom", err: "No id was given" });
    if (!Object.keys(readFileSync().rooms).includes(options.id)) return resolve({ action: "leaveRoom", err: "Id does not exist" });
    if (!userId) return resolve({ action: "leaveRoom", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "leaveRoom", err: "Invalid user id" });
    if (readFileSync().rooms[options.id].privat === true && (!Object.keys(options).includes("token") || !options.token)) return resolve({ action: "leaveRoom", err: "No token was given" });
    if (readFileSync().rooms[options.id].privat === true && (readFileSync().rooms[options.id].token !== options.token)) return resolve({ action: "leaveRoom", err: "Invalid token" });
    var buffer = readFileSync().rooms;
    delete buffer[options.id].users[userId];
    fs.writeFile(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8', function (err) {
      if (err) return resolve({ action: "leaveRoom", err: err.message });
      return resolve({ action: "leaveRoom", userId, id: options.id, username: readFileSync().users[userId].username })
    });
  });
}

function leaveRoomSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "leaveRoomSync", err: "No options were given" };
  if (!Object.keys(options).includes("id") || !options.id) return { action: "leaveRoomSync", err: "No id was given" };
  if (!Object.keys(readFileSync().rooms).includes(options.id)) return { action: "leaveRoomSync", err: "Id does not exist" };
  if (!userId) return { action: "leaveRoomSync", err: "No user id was given" };
  if (!Object.keys(readFileSync().users).includes(userId)) return { action: "leaveRoomSync", err: "Invalid user id" };
  if (readFileSync().rooms[options.id].privat === true && (!Object.keys(options).includes("token") || !options.token)) return { action: "leaveRoomSync", err: "No token was given" };
  if (readFileSync().rooms[options.id].privat === true && (readFileSync().rooms[options.id].token !== options.token)) return { action: "leaveRoomSync", err: "Invalid token" };
  var buffer = readFileSync().rooms;
  delete buffer[options.id].users[userId];
  try {
    fs.writeFileSync(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8');
  } catch (err) {
    return { action: "leaveRoomSync", err: err.message };
  }
  return { action: "leaveRoomSync", userId, id: options.id, username: readFileSync().users[userId].username }
}

function sendMessage(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "sendMessage", err: "No options were given" });
    if (!Object.keys(options).includes("id") || !options.id) return resolve({ action: "sendMessage", err: "No id was given" });
    if (!userId) return resolve({ action: "sendMessage", err: "No user id was given" });
    if (!Object.keys(readFileSync().rooms[options.id].users).includes(userId)) return resolve({ action: "sendMessage", err: "Invalid user id" });
    if (!Object.keys(options).includes("message") || !options.message) return resolve({ action: "sendMessage", err: "No message was given" });
    if ((extraOptions?.messageCharacterLimit) && (options.message.length > extraOptions.messageCharacterLimit)) return resolve({ action: "sendMessage", err: "Message is too long" });
    var buffer = readFileSync().rooms;
    buffer[options.id].messages.push([options.message, { userId, username: readFileSync().users[userId].username }]);
    fs.writeFile(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8', function (err) {
      if (err) return resolve({ action: "sendMessage", err: err.message });
      return resolve({ action: "sendMessage", userId, username: readFileSync().users[userId].username, id: options.id, message: options.message, messageId: readFileSync().rooms[options.id].messages.length });
    });
  });
}

function sendMessageSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "sendMessageSync", err: "No options were given" };
  if (!Object.keys(options).includes("id") || !options.id) return { action: "sendMessageSync", err: "No id was given" };
  if (!userId) return { action: "sendMessageSync", err: "No user id was given" };
  if (!Object.keys(readFileSync().rooms[options.id].users).includes(userId)) return { action: "sendMessageSync", err: "Invalid user id" };
  if (!Object.keys(options).includes("message") || !options.message) return { action: "sendMessageSync", err: "No message was given" };
  if ((extraOptions?.messageCharacterLimit) && (options.message.length > extraOptions.messageCharacterLimit)) return { action: "sendMessageSync", err: "Message is too long" };
  var buffer = readFileSync().rooms;
  buffer[options.id].messages.push([options.message, { userId, username: readFileSync().users[userId].username }]);
  try {
    fs.writeFileSync(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8');
  } catch (err) {
    return { action: "sendMessageSync", err: err.message };
  }
  return { action: "sendMessageSync", userId, username: readFileSync().users[userId].username, id: options.id, message: options.message, messageId: readFileSync().rooms[options.id].messages.length };
}

function editMessage(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "editMessage", err: "No options were given" });
    if (!userId) return resolve({ action: "editMessage", err: "No user id was given" });
    if (!Object.keys(readFileSync().rooms[options.id].users).includes(userId)) return resolve({ action: "editMessage", err: "Invalid user id" });
    if (!Object.keys(options).includes("id") || !options.id) return resolve({ action: "editMessage", err: "No id was given" });
    if (!Object.keys(readFileSync().rooms).includes(options.id)) return resolve({ action: "editMessage", err: "Invalid id" });
    if (!Object.keys(options).includes("messageId") || !options.messageId) return resolve({ action: "editMessage", err: "No message id was given" });
    if ((typeof options.messageId !== "number") || options.messageId < 1 || options.messageId > readFileSync().rooms[options.id].messages.length) return resolve({ action: "editMessage", err: "Invalid message id" });
    if (readFileSync().rooms[options.id].messages[messageId - 1][1].userId !== userId) return resolve({ action: "editMessage", err: "You have not send this message" });
    if (!Object.keys(options).includes("options") || !options.options) return resolve({ action: "editMessage", err: "No new options were given" });
    if (options.options.message && ((extraOptions?.messageCharacterLimit) && (options.options.message.length > extraOptions.messageCharacterLimit))) return resolve({ action: "editMessage", err: "Message is too long" });
    var buffer = readFileSync().rooms;
    buffer[options.id].messages[messageId - 1] = [options.options.message || readFileSync().rooms[options.id].messages[messageId - 1][0], { userId, username: readFileSync().users[userId].username }];
    fs.writeFile(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8', function (err) {
      if (err) return resolve({ action: "editMessage", err: err.message });
      return resolve({ action: "editMessage", userId, username: readFileSync().users[userId].username, id: options.id, options: options.options, messageId: options.messageId });
    });
  });
}

function editMessageSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "editMessageSync", err: "No options were given" };
  if (!userId) return { action: "editMessageSync", err: "No user id was given" };
  if (!Object.keys(readFileSync().rooms[options.id].users).includes(userId)) return { action: "editMessageSync", err: "Invalid user id" };
  if (!Object.keys(options).includes("id") || !options.id) return { action: "editMessageSync", err: "No id was given" };
  if (!Object.keys(readFileSync().rooms).includes(options.id)) return { action: "editMessageSync", err: "Invalid id" };
  if (!Object.keys(options).includes("messageId") || !options.messageId) return { action: "editMessageSync", err: "No message id was given" };
  if ((typeof options.messageId !== "number") || options.messageId < 1 || options.messageId > readFileSync().rooms[options.id].messages.length) return { action: "editMessageSync", err: "Invalid message id" };
  if (readFileSync().rooms[options.id].messages[messageId - 1][1].userId !== userId) return { action: "editMessageSync", err: "You have not send this message" };
  if (!Object.keys(options).includes("options") || !options.options) return { action: "editMessageSync", err: "No new options were given" };
  if (options.options.message && ((extraOptions?.messageCharacterLimit) && (options.options.message.length > extraOptions.messageCharacterLimit))) return { action: "editMessageSync", err: "Message is too long" };
  var buffer = readFileSync().rooms;
  buffer[options.id].messages[messageId - 1] = [options.options.message || readFileSync().rooms[options.id].messages[messageId - 1][0], { userId, username: readFileSync().users[userId].username }];
  try {
    fs.writeFileSync(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8');
  } catch (err) {
    return { action: "editMessageSync", err: err.message };
  }
  return { action: "editMessageSync", userId, username: readFileSync().users[userId].username, id: options.id, options: options.options, messageId: options.messageId };
}

function deleteMessage(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "deleteMessage", err: "No options were given" });
    if (!Object.keys(options).includes("id") || !options.id) return resolve({ action: "deleteMessage", err: "No id was given" });
    if (!Object.keys(readFileSync().rooms).includes(options.id)) return resolve({ action: "deleteMessage", err: "Invalid id" });
    if (!userId) return resolve({ action: "deleteMessage", err: "No user id was given" });
    if (!Object.keys(readFileSync().rooms[options.id].users).includes(userId)) return resolve({ action: "deleteMessage", err: "Invalid user id" });
    if (!Object.keys(options).includes("messageId") || !options.messageId) return resolve({ action: "deleteMessage", err: "No message id was given" });
    if ((typeof options.messageId !== "number") || options.messageId < 1 || options.messageId > readFileSync().rooms[options.id].messages.length) return resolve({ action: "deleteMessage", err: "Invalid message id" });
    if (readFileSync().rooms[options.id].messages[messageId - 1][1].userId !== userId) return resolve({ action: "deleteMessage", err: "You have not send this message" });
    var buffer = readFileSync().rooms;
    buffer[options.id].messages.splice(options.messageId - 1, 1);
    fs.writeFile(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8', function (err) {
      if (err) return resolve({ action: "deleteMessage", err: err.message });
      return resolve({ action: "deleteMessage", userId, username: readFileSync().users[userId].username, id: options.id, messageId: options.messageId });
    });
  });
}

function deleteMessageSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "deleteMessageSync", err: "No options were given" };
  if (!Object.keys(options).includes("id") || !options.id) return { action: "deleteMessageSync", err: "No id was given" };
  if (!Object.keys(readFileSync().rooms).includes(options.id)) return { action: "deleteMessageSync", err: "Invalid id" };
  if (!userId) return { action: "deleteMessageSync", err: "No user id was given" };
  if (!Object.keys(readFileSync().rooms[options.id].users).includes(userId)) return { action: "deleteMessageSync", err: "Invalid user id" };
  if (!Object.keys(options).includes("messageId") || !options.messageId) return { action: "deleteMessageSync", err: "No message id was given" };
  if ((typeof options.messageId !== "number") || options.messageId < 1 || options.messageId > readFileSync().rooms[options.id].messages.length) return resolve({ action: "deleteMessageSync", err: "Invalid message id" });
  if (readFileSync().rooms[options.id].messages[messageId - 1][1].userId !== userId) return resolve({ action: "deleteMessageSync", err: "You have not send this message" });
  var buffer = readFileSync().rooms;
  buffer[options.id].messages.splice(options.messageId - 1, 1);
  try {
    fs.writeFileSync(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8');
  } catch (err) {
    return { action: "deleteMessageSync" };
  }
  return { action: "deleteMessageSync", userId, username: readFileSync().users[userId].username, id: options.id, messageId: options.messageId };
}

function getMessage(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "getMessage", err: "No options were given" });
    if (!Object.keys(options).includes("id") || !options.id) return resolve({ action: "getMessage", err: "No id was given" });
    if (!Object.keys(readFileSync().rooms).includes(options.id)) return resolve({ action: "getMessage", err: "Invalid id" });
    if (!userId) return resolve({ action: "getMessage", err: "No user id was given" });
    if (!Object.keys(readFileSync().rooms[options.id].users).includes(userId)) return resolve({ action: "getMessage", err: "Invalid user id" });
    if (!Object.keys(options).includes("messageId") || !options.messageId) return resolve({ action: "getMessage", err: "No message id was given" });
    if ((typeof options.messageId !== "number") || options.messageId < 1 || options.messageId > readFileSync().rooms[options.id].messages.length) return resolve({ action: "getMessage", err: "Invalid message id" });
    if (!Object.keys(readFileSync().rooms[options.id].users).includes(userId)) return resolve({ action: "getMessage", err: "You are not in the room where the message was send" });
    return resolve({ action: "getMessage", id: options.id, messageId: options.messageId, result: { message: readFileSync().rooms[options.id].messages[options.messageId - 1][0], messageAuthor: { userId: readFileSync().rooms[options.id].messages[options.messageId - 1][1].userId, username: readFileSync().rooms[options.id].messages[options.messageId - 1][1].username } } });
  });
}

function getMessageSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "getMessage", err: "No options were given" };
  if (!Object.keys(options).includes("id") || !options.id) return { action: "getMessage", err: "No id was given" };
  if (!Object.keys(readFileSync().rooms).includes(options.id)) return { action: "getMessage", err: "Invalid id" };
  if (!userId) return { action: "getMessage", err: "No user id was given" };
  if (!Object.keys(readFileSync().rooms[options.id].users).includes(userId)) return { action: "getMessage", err: "Invalid user id" };
  if (!Object.keys(options).includes("messageId") || !options.messageId) return { action: "getMessage", err: "No message id was given" };
  if ((typeof options.messageId !== "number") || options.messageId < 1 || options.messageId > readFileSync().rooms[options.id].messages.length) return { action: "getMessage", err: "Invalid message id" };
  if (!Object.keys(readFileSync().rooms[options.id].users).includes(userId)) return { action: "getMessage", err: "You are not in the room where the message was send" };
  return { action: "getMessage", id: options.id, messageId: options.messageId, result: { message: readFileSync().rooms[options.id].messages[options.messageId - 1][0], messageAuthor: { userId: readFileSync().rooms[options.id].messages[options.messageId - 1][1].userId, username: readFileSync().rooms[options.id].messages[options.messageId - 1][1].username } } };
}

function createUser(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "createUser", err: "No options were given" });
    if (!Object.keys(options).includes("username") || !options.username) return resolve({ action: "createUser", err: "No username was given" });
    if ((extraOptions?.usernameCharacterLimit) && (options.username.length > extraOptions.usernameCharacterLimit)) return resolve({ action: "createUser", err: "Username is too long" });
    if (!userId) return resolve({ action: "createUser", err: "No user id was given" });
    fs.writeFile(module.exports.options.file, JSON.stringify({
      users: {
        ...readFileSync().users,
        ...{
          [userId]: {
            username: options.username,
            avatar: options.avatar || null
          }
        }
      },
      rooms: readFileSync().rooms
    }), 'utf8', function (err) {
      if (err) return resolve({ action: "createUser", err: err.message });
      return resolve({ action: "createUser", userId, username: options.username, avatar: options.avatar || null });
    });
  });
}

function createUserSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "createUserSync", err: "No options were given" };
  if (!Object.keys(options).includes("username") || !options.username) return { action: "createUserSync", err: "No username was given" };
  if ((extraOptions?.usernameCharacterLimit) && (options.username.length > extraOptions.usernameCharacterLimit)) return { action: "createUserSync", err: "Username is too long" };
  if (!userId) return { action: "createUserSync", err: "No user id was given" };
  try {
    fs.writeFileSync(module.exports.options.file, JSON.stringify({
      users: {
        ...readFileSync().users,
        ...{
          [userId]: {
            username: options.username,
            avatar: options.avatar || null
          }
        }
      },
      rooms: readFileSync().rooms
    }), 'utf8');
  } catch (err) {
    return { action: "createUserSync", err: err.message };
  }
  return { action: "createUserSync", userId, username: options.username, avatar: options.avatar || null };
}

function editUser(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "editUser", err: "No options were given" });
    if (!Object.keys(options).includes("options") || !options.options) return resolve({ action: "editUser", err: "No new options was given" });
    if (!userId) return resolve({ action: "editUser", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "editUser", err: "Invalid user id" });
    if (options?.options?.avatar && !isURLSync({ url: options?.options?.avatar })) return resolve({ action: "editUser", err: "Avatar is not a valid url" });
    if (options?.options?.username && ((extraOptions?.usernameCharacterLimit) && (options?.options?.username?.length > extraOptions.usernameCharacterLimit))) return resolve({ action: "editUser", err: "Username is too long" });
    fs.writeFile(module.exports.options.file, JSON.stringify({
      users: {
        ...readFileSync().users,
        ...{
          [userId]: {
            username: options?.options?.username || readFileSync().users[userId].username,
            avatar: options?.options?.avatar || readFileSync().users[userId]?.avatar || null
          }
        }
      },
      rooms: readFileSync().rooms
    }), 'utf8', function (err) {
      if (err) return resolve({ action: "editUser", err: err.message });
      return resolve({ action: "editUser", userId, options: options.options });
    });
  });
}

function editUserSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "editUserSync", err: "No options were given" };
  if (!Object.keys(options).includes("options") || !options.options) return { action: "editUserSync", err: "No new options was given" };
  if (!userId) return { action: "editUserSync", err: "No user id was given" };
  if (!Object.keys(readFileSync().users).includes(userId)) return { action: "editUserSync", err: "Invalid user id" };
  if (options?.options?.avatar && !isURLSync({ url: options?.options?.avatar })) return { action: "editUserSync", err: "Avatar is not a valid url" };
  if (options?.options?.username && ((extraOptions?.usernameCharacterLimit) && (options?.options?.username?.length > extraOptions.usernameCharacterLimit))) return { action: "editUserSync", err: "Username is too long" };
  try {
    fs.writeFileSync(module.exports.options.file, JSON.stringify({
      users: {
        ...readFileSync().users,
        ...{
          [userId]: {
            username: options?.options?.username || readFileSync().users[userId].username,
            avatar: options?.options?.avatar || readFileSync().users[userId]?.avatar || null
          }
        }
      },
      rooms: readFileSync().rooms
    }), 'utf8');
  } catch (err) {
    return { action: "editUserSync", err: err.message };
  }
  return { action: "editUserSync", userId, options: options.options };
}

function deleteUser(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!userId) return resolve({ action: "deleteUser", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "deleteUser", err: "Invalid user id" });
    var username = readFileSync().users[userId].username;
    var buffer = readFileSync().users;
    delete buffer[userId];
    Object.entries(readFileSync().rooms).forEach((room) => {
      leaveRoom(room[1], { userId });
    });
    fs.writeFile(module.exports.options.file, JSON.stringify({ users: buffer, rooms: readFileSync().rooms }), 'utf8', function (err) {
      if (err) return resolve({ action: "deleteUser", err: err.message });
      return resolve({ action: "deleteUser", userId, username });
    });
  });
}

function deleteUserSync(userId, options, extraOptions) {
  if (!userId) return { action: "deleteUserSync", err: "No user id was given" };
  if (!Object.keys(readFileSync().users).includes(userId)) return { action: "deleteUserSync", err: "Invalid user id" };
  var user = readFileSync().users[userId];
  var buffer = readFileSync().users;
  delete buffer[userId];
  Object.entries(readFileSync().rooms).forEach((room) => {
    leaveRoom(room[1], { userId });
  });
  try {
    fs.writeFileSync(module.exports.options.file, JSON.stringify({ users: buffer, rooms: readFileSync().rooms }), 'utf8');
  } catch (err) {
    return { action: "deleteUserSync", err: err.message };
  }
  return { action: "deleteUserSync", userId, username: user.username, avatar: user.avatar || null };
}

function getUser(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!userId) return resolve({ action: "getUser", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "getUser", err: "Invalid user id" });
    return resolve({ action: "getUser", userId, username: readFileSync().users[userId].username, avatar: readFileSync().users?.[userId].avatar || null });
  });
}

function getUserSync(userId, options, extraOptions) {
  if (!userId) return { action: "getUserSync", err: "No user id was given" };
  if (!Object.keys(readFileSync().users).includes(userId)) return { action: "getUserSync", err: "Invalid user id" };
  return { action: "getUserSync", userId, username: readFileSync().users[userId].username, avatar: readFileSync().users?.[userId].avatar || null };
}

class Chat {
  constructor(options, configOptions) {
    configRoomsSync(options);
    this.options = configOptions;
  }
  createManager(type) {
    if (type === "rooms") {
      return new RoomManager();
    } else if (type === "users") {
      return new UserManager();
    } else if (type === "messages") {
      return new MessageManager();
    } else if (type === "util") {
      return new UtilManager();
    } else if (type === "functions") {
      return new FunctionManager();
    } else {
      return { action: "createManager", err: "Invalid manager type" }
    }
  }
  createRoomManager() {
    return new RoomManager();
  }
  createUserManager() {
    return new UserManager();
  }
  createMessageManager() {
    return new MessageManager();
  }
  createUtilManager() {
    return new UtilManager();
  }
  rooms(otherOptions) {
    return {
      create: function (options, extraOptions) {
        createRoom(options, extraOptions || otherOptions || this.options).then((result) => {
          return result;
        });
      },
      edit: function (options, extraOptions) {
        editRoom(options, extraOptions || otherOptions || this.options).then((result) => {
          return result;
        });
      },
      delete: function (options, extraOptions) {
        deleteRoom(options, extraOptions || otherOptions || this.options).then((result) => {
          return result;
        });
      },
      get: function (options, extraOptions) {
        getRoom(options, extraOptions || otherOptions || this.options).then((result) => {
          return result;
        });
      },
      all: function (options, extraOptions) {
        allRooms(options, extraOptions || otherOptions || this.options).then((result) => {
          return result;
        });
      },
      functions: function () {
        return {
          create: createRoom,
          edit: editRoom,
          delete: deleteRoom,
          get: getRoom,
          all: allRooms,
          sync: function () {
            return {
              all: allRoomsSync
            }
          }
        }
      }
    }
  }
  users(otherOptions) {
    return {
      create: function (options, extraOptions) {
        createUser(options, extraOptions || otherOptions || this.options).then((result) => {
          return result;
        });
      },
      edit: function (options, extraOptions) {
        editUser(options, extraOptions || otherOptions || this.options).then((result) => {
          return result;
        });
      },
      delete: function (options, extraOptions) {
        deleteUser(options, extraOptions || otherOptions || this.options).then((result) => {
          return result;
        });
      },
      get: function (options, extraOptions) {
        getUser(options, extraOptions || otherOptions || this.options).then((result) => {
          return result;
        });
      },
      functions: function () {
        return {
          create: createUser,
          edit: editUser,
          delete: deleteUser,
          get: getUser,
          sync: function () {
            return {
              get: getUserSync
            }
          }
        }
      }
    }
  }
  messages(otherOptions) {
    return {
      send: function (options, extraOptions) {
        sendMessage(options, extraOptions || otherOptions || this.options).then((result) => {
          return result;
        });
      },
      edit: function (options, extraOptions) {
        editMessage(options, extraOptions || otherOptions || this.options).then((result) => {
          return result;
        });
      },
      delete: function (options, extraOptions) {
        deleteMessage(options, extraOptions || otherOptions || this.options).then((result) => {
          return result;
        });
      },
      functions: function () {
        return {
          send: sendMessage,
          edit: editMessage,
          delete: deleteMessage,
          get: getMessage,
          sync: function () {
            return {
              get: getMessageSync
            }
          }
        }
      }
    }
  }
  util(otherOptions) {
    return {
      isURL: function (options, extraOptions) {
        isURL(options, extraOptions || otherOptions || this.options).then((result) => {
          return result;
        });
      },
      functions: function () {
        return {
          isURL,
          sync: function () {
            return {
              isURL: isURLSync
            }
          }
        }
      }
    }
  }
  functions() {
    return {
      example: defaultFunction
    }
  }
}

class RoomManager {
  create(options) {
    createRoom(options).then((result) => {
      return result;
    });
  }
  edit(options) {
    editRoom(options).then((result) => {
      return result;
    });
  }
  delete(options) {
    deleteRoom(options).then((result) => {
      return result;
    });
  }
  get(options) {
    getRoom(options).then((result) => {
      return result;
    });
  }
  all(options) {
    allRooms(options).then((result) => {
      return result;
    });
  }
  functions() {
    return {
      create: createRoom,
      edit: editRoom,
      delete: deleteRoom,
      get: getRoom,
      all: allRooms,
      sync: function () {
        return {
          all: allRoomsSync
        }
      }
    }
  }
}

class UserManager {
  create(options) {
    createUser(options).then((result) => {
      return result;
    });
  }
  edit(options) {
    editUser(options).then((result) => {
      return result;
    });
  }
  delete(options) {
    deleteUser(options).then((result) => {
      return result;
    });
  }
  get(options) {
    getUser(options).then((result) => {
      return result;
    });
  }
  functions() {
    return {
      create: createUser,
      edit: editUser,
      delete: deleteUser,
      get: getUser,
      sync: function () {
        return {
          get: getUserSync
        }
      }
    }
  }
}

class MessageManager {
  send(options) {
    sendMessage(options).then((result) => {
      return result;
    });
  }
  edit(options) {
    editMessage(options).then((result) => {
      return result;
    });
  }
  delete(options) {
    deleteMessage(options).then((result) => {
      return result;
    });
  }
  get(options) {
    getMessage(options).then((result) => {
      return result;
    });
  }
  functions() {
    return {
      send: sendMessage,
      edit: editMessage,
      delete: deleteMessage,
      get: getMessage,
      sync: function () {
        return {
          get: getMessageSync
        }
      }
    }
  }
}

class UtilManager {
  isURL(options) {
    isURL(options).then((result) => {
      return result;
    });
  }
  functions() {
    return {
      isURL,
      sync: function () {
        return {
          isURL: isURLSync
        }
      }
    }
  }
}

class FunctionManager {
  example(socket, name) {
    defaultFunction(socket, name);
  }
}

module.exports = {
  Chat,
  RoomManager,
  UserManager,
  MessageManager,
  UtilManager,
  FunctionManager,
  defaultFunction,
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
  allRoomsSync,
  isURLSync,
  getUserSync,
  getMessageSync,
  Types: {
    Managers: {
      Rooms: "rooms",
      Users: "users",
      Messages: "messages",
      Util: "util",
      Functions: "functions"
    }
  }
}
