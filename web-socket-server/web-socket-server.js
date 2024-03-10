const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  },
});

io.on("connection", (socket) => {
  // To send socket ID to client
  socket.emit("socketID", socket.id);

  // To call other user
  socket.on("call", ({ socketID, name, iceConfig }) => {
    io.to(socketID).emit("incomingCall", {
      iceConfig,
      name,
      toSocketID: socket.id,
    });
  });

  // To
  socket.on("answerCall", ({ iceConfig, toSocketID, toName }) => {
    io.to(toSocketID).emit("acceptedCall", { iceConfig, toName });
  });
});

console.log("server started successfully", process.env.PORT);

server.listen(process.env.PORT || 5000);
