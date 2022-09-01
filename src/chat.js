const fs = require('fs');
const crypto = require('crypto');

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

function configRooms(options) {
  return new Promise((resolve, reject) => {
    if (!options || typeof options !== "object") return resolve({ action: "configRooms", err: "Invalid options" });
    module.exports = {
      options
    }
    return resolve({ action: "configRooms", options });
  });
}

function configRoomsSync(options) {
  if (!options || typeof options !== "object") return { action: "configRoomsSync", err: "Invalid options" };
  module.exports = {
    options
  }
  return { action: "configRoomsSync", options };
}

function createRoom(userId, options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "createRoom", err: "No options were given" });
    if (!Object.keys(options).includes("name") || !options.name) return resolve({ action: "createRoom", err: "No name was given" });
    if (!userId) return resolve({ action: "createRoom", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "createRoom", err: "Invalid user id" });
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

function editRoom(userId, options) {
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

function deleteRoom(userId, options) {
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
      return resolve({ action: "deleteRoom", userId, id: options.id, options: options.options });
    });
  });
}

function getRoom(userId, options) {
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

function allRooms(userId) {
  return new Promise((resolve, reject) => {
    if (!userId) return resolve({ action: "allRooms", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "allRooms", err: "Invalid user id" });
    return resolve({ action: "allRooms", userId, rooms: Object.entries(readFileSync().rooms).filter((item) => item[1].privat === false).map((item) => ({ id: item[0], name: item[1].name })) });
  });
}

function allRoomsSync(userId) {
  if (!userId) return resolve({ action: "allRoomsSync", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "allRoomsSync", err: "Invalid user id" });
  return { action: "allRoomsSync", userId, rooms: Object.entries(readFileSync().rooms).filter((item) => item[1].privat === false).map((item) => ({ id: item[0], name: item[1].name })) };
}

function joinRoom(userId, options) {
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
      return resolve({ actiom: "joinRoom", userId, id: options.id, username: readFileSync().users[userId].username })
    });
  });
}

function leaveRoom(userId, options) {
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

function sendMessage(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "sendMessage", err: "No options were given" });
    if (!Object.keys(options).includes("id") || !options.id) return resolve({ action: "sendMessage", err: "No id was given" });
    if (!userId) return resolve({ action: "sendMessage", err: "No user id was given" });
    if (!Object.keys(readFileSync().rooms[options.id].users).includes(userId)) return resolve({ action: "sendMessage", err: "Invalid user id" });
    if (!Object.keys(options).includes("message") || !options.message) return resolve({ action: "sendMessage", err: "No message was given" });
    if ((extraOptions?.messageLimit) && (options.message.length > extraOptions.messageLimit)) return resolve({ action: "sendMessage", err: "Message is too long" });
    var buffer = readFileSync().rooms;
    buffer[options.id].messages.push([options.message, { userId, username: readFileSync().users[userId].username }]);
    fs.writeFile(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8', function (err) {
      if (err) return resolve({ action: "sendMessage", err: err.message });
      return resolve({ action: "sendMessage", userId, username: readFileSync().users[userId].username, message: options.message, messageId: readFileSync().rooms[options.id].messages.length });
    });
  });
}

function deleteMessage(userId, options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "deleteMessage", err: "No options were given" });
    if (!Object.keys(options).includes("id") || !options.id) return resolve({ action: "deleteMessage", err: "No id was given" });
    if (!userId) return resolve({ action: "deleteMessage", err: "No user id was given" });
    if (!Object.keys(options).includes("messageId") || !options.messageId) return resolve({ action: "deleteMessage", err: "No message id was given" });
    if ((typeof options.messageId !== "number") || options.messageId < 1 || options.messageId > readFileSync().rooms[options.id].messages.length) return resolve({ action: "deleteMessage", err: "Invalid message id" });
    if (!Object.keys(readFileSync().rooms[options.id].users).includes(userId)) return resolve({ action: "deleteMessage", err: "Invalid user id" });
    var buffer = readFileSync().rooms;
    buffer[options.id].messages.splice(options.messageId, 1);
    fs.writeFile(module.exports.options.file, JSON.stringify({ users: readFileSync().users, rooms: buffer }), 'utf8', function (err) {
      if (err) return resolve({ action: "deleteMessage", err: err.message });
      return resolve({ action: "deleteMessage", userId, username: readFileSync().users[userId].username, messageId: options.messageId });
    });
  });
}

function createUser(userId, options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "createUser", err: "No options were given" });
    if (!Object.keys(options).includes("username") || !options.username) return resolve({ action: "createUser", err: "No username was given" });
    if (!userId) return resolve({ action: "createUser", err: "No user id was given" });
    fs.writeFile(module.exports.options.file, JSON.stringify({
      users: {
        ...readFileSync().users,
        ...{
          [userId]: {
            username: options.username,
            avatar: null
          }
        }
      },
      rooms: readFileSync().rooms
    }), 'utf8', function (err) {
      if (err) return resolve({ action: "createUser", err: err.message });
      return resolve({ action: "createUser", userId, username: options.username });
    });
  });
}

function editUser(userId, options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "editUser", err: "No options were given" });
    if (!Object.keys(options).includes("options") || !options.options) return resolve({ action: "editUser", err: "No new options was given" });
    if (!userId) return resolve({ action: "editUser", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "editUser", err: "Invalid user id" });
    if (options?.options?.avatar && !isURLSync({ url: options?.options?.avatar })) return resolve({ action: "editUser", err: "Avatar is not a valid url" });
    fs.writeFile(module.exports.options.file, JSON.stringify({
      users: {
        ...readFileSync().users,
        ...{
          [userId]: {
            username: options?.username || readFileSync().users[userId].username,
            avatar: options?.avatar || readFileSync().users[userId]?.avatar || null
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

function deleteUser(userId) {
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

function getUser(userId) {
  return new Promise((resolve, reject) => {
    if (!userId) return resolve({ action: "getUser", err: "No user id was given" });
    if (!Object.keys(readFileSync().users).includes(userId)) return resolve({ action: "getUser", err: "Invalid user id" });
    return resolve({ action: "getUser", userId, username: readFileSync().users[userId].username, avatar: readFileSync().users?.[userId].avatar || null });
  });
}

function getUserSync(userId) {
  if (!userId) return { action: "getUserSync", err: "No user id was given" };
  if (!Object.keys(readFileSync().users).includes(userId)) return { action: "getUserSync", err: "Invalid user id" };
  return { action: "getUserSync", userId, username: readFileSync().users[userId].username, avatar: readFileSync().users?.[userId].avatar || null };
}

class Chat {
  constructor(options, configOptions) {
    configRoomsSync(options);
    this.options = configOptions;
  }
  createRoomManager(options) {
    return new RoomManager(options);
  }
  createUserManager(options) {
    return new UserManager(options);
  }
  createMessageManager(options) {
    return new MessageManager(options);
  }
  rooms(otherOptions) {
    return {
      create: function (options, extraOptions) {
        createRoom(options, extraOptions || otherOptions || this.options);
      },
      edit: function (options, extraOptions) {
        editRoom(options, extraOptions || otherOptions || this.options);
      },
      delete: function (options, extraOptions) {
        deleteRoom(options, extraOptions || otherOptions || this.options);
      },
      get: function (options, extraOptions) {
        getRoom(options, extraOptions || otherOptions || this.options);
      },
      all: function (options, extraOptions) {
        allRooms(options, extraOptions || otherOptions || this.options);
      }
    }
  }
  users(otherOptions) {
    return {
      create: function (options, extraOptions) {
        createUser(options, extraOptions || otherOptions || this.options);
      },
      edit: function (options, extraOptions) {
        editUser(options, extraOptions || otherOptions || this.options);
      },
      delete: function (options, extraOptions) {
        deleteUser(options, extraOptions || otherOptions || this.options);
      },
      get: function (options, extraOptions) {
        getRoom(options, extraOptions || otherOptions || this.options);
      }
    }
  }
  messages(otherOptions) {
    return {
      send: function (options, extraOptions) {
        sendMessage(options, extraOptions || otherOptions || this.options);
      },
      edit: function (options, extraOptions) {
        editMessage(options, extraOptions || otherOptions || this.options);
      },
      delete: function (options, extraOptions) {
        deleteMessage(options, extraOptions || otherOptions || this.options);
      }
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
  all() {
    allRooms().then((result) => {
      return result;
    });
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
}

class MessageManager {
  send(options) {
    sendMessage(options).then((result) => {
      return result;
    });
  }
  delete(options) {
    deleteMessage(options).then((result) => {
      return result;
    });
  }
}

module.exports = {
  Chat,
  RoomManager,
  UserManager,
  MessageManager,
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
  deleteMessage,
  createUser,
  editUser,
  deleteUser,
  getUser,
  isURLSync,
  configRoomsSync,
  allRoomsSync,
  isURLSync
}
