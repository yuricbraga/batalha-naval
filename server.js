const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  return res.status(200).send({ msg: "Hello world" });
});

io.on("connection", (socket) => {
  io.emit("new connection", socket.client.id);
  socket.on("bomb", (position) => {
    io.emit("explosion" ,[socket.client.id, position]);
  })
});

const PORT = 9000;
http.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`);
});
