const express = require("express");
const { errorHandler } = require("./commonFunctions");
require("dotenv").config();
require("./connection");
const account = require("./controller/account/account.controller");
const post = require("./controller/post/post.controller");
const user = require("./controller/user/user.controller");
const auth = require("./middleware/auth");
const chat = require("./controller/chat/chat.controller");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.BASE_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});
const cors = require("cors");

const corsOptions = {
  origin: process.env.BASE_URL,
  exposedHeaders: "x-auth-token",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.disable("x-powered-by");
app.use(express.json());
app.use(cors(corsOptions));
app.get("/",(_req,res)=>res.send("welcome to instagram backend"))
app.use("/account", account);
app.all("*", auth);
app.use("/post", post);
app.use("/user", user);
app.use("/chat", chat);
app.use(errorHandler);

io.on("connection", (client) => {
  client.on("setup user", (userId) => {
    client.join(userId);
    io.emit("connected");
    io.to('chatRoom').emit("user joined room");
  });
  client.on("join chat", (chatId) => {
    client.join(chatId);
  });
  client.on("new message", (messageData) => {
    const {senderId,userIds} = messageData
    userIds.forEach(ids=>{
      if(ids!==senderId)
      {
        client.in(ids).emit("message received",messageData)
      }
    })

  })
});
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`server running on port ${port}`);
});