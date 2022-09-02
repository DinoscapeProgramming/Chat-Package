function defaultFunction(socket, name) { 
  ["createRoom", "editRoom", "deleteRoom", "getRoom", "allRooms", "joinRoom", "leaveRoom", "sendMessage", "editMessage", "deleteMessage", "createUser"].forEach((action) => {
    socket.on(action, (options) => {
      chat[action](socket.id, options).then((result) => {
        socket.emit(socket.id, result);
      });
    });
  });
  socket.on("disconnect", () => {
    chat.deleteUser(socket.id).then((result) => {
      socket.emit(socket.id, result);
    });
  });
}

module.exports = { defaultFunction };
