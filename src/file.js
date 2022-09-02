const socket = io();

class Chat {
  createManager(type) {
    if (type === "rooms") {
      return new RoomManager();
    } else if (type === "messages") {
      return new MessageManager();
    } else if (type === "users") {
      return new UserManager();
    } else {
      return { action: "createManager", err: "Invalid manager type" }
    }
  }
  createRoomManager() {
    return new RoomManager();
  }
  createMessageManager() {
    return new MessageManager();
  }
  createUserManager() {
    return new UserManager();
  }
  rooms() {
    return {
      create: function (options) {
        socket.emit("createRoom", options);
      },
      edit: function (options) {
        socket.emit("editRoom", options);
      },
      delete: function (options) {
        socket.emit("deleteRoom", options);
      },
      get: function (options) {
        socket.emit("getRoom", options);
      }
    }
  }
  messages() {
    return {
      send: function (options) {
        socket.emit("sendMessage", options);
      },
      edit: function (options) {
        socket.emit("editMessage", options);
      },
      delete: function (options) {
        socket.emit("deleteMessage", options);
      },
      get: function (options) {
        socket.emit("getMessage", options);
      }
    }
  }
  users() {
    return {
      create: function (options) {
        socket.emit("createUser", options);
      },
      edit: function (options) {
        socket.emit("editUser", options);
      },
      delete: function (options) {
        socket.emit("deleteUser", options);
      },
      get: function (options) {
        socket.emit("getUser", options);
      }
    }
  }
}

class RoomManager {
  create(options) {
    socket.emit("createRoom", options);
  }
  edit(options) {
    socket.emit("editRoom", options);
  }
  delete(options) {
    socket.emit("deleteRoom", options);
  }
  get(options) {
    socket.emit("getRoom", options);
  }
}

class MessageManager {
  send(options) {
    socket.emit("sendMessage", options);
  }
  edit(options) {
    socket.emit("editMessage", options);
  }
  delete(options) {
    socket.emit("deleteMessage", options);
  }
  get(options) {
    socket.emit("getMessage", options);
  }
}

class UserManager {
  create(options) {
    socket.emit("createUser", options);
  }
  edit(options) {
    socket.emit("editUser", options);
  }
  delete(options) {
    socket.emit("deleteUser", options);
  }
  get(options) {
    socket.emit("getUser", options);
  }
}

const Types = {
  Managers: {
    Rooms: "rooms",
    Messages: "messages",
    Users: "users"
  }
}

const chat = {
  Chat,
  RoomManager,
  MessageManager,
  UserManager,
  Types
}
