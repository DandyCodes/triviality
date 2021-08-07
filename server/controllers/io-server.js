const chalk = require("chalk");

module.exports = function ioServer(io) {
  io.on("connection", socket => {
    console.log(`Client ${chalk.blueBright(socket.id)} connected`);
    socket.emit("privateMessage", "Connected");

    socket.on("messageAll", msg => {
      io.emit("messageAll", msg);
      console.log(
        `Client ${chalk.blueBright(
          socket.id
        )} messaged all: ${chalk.default.redBright(msg)}`
      );
    });
  });
};
