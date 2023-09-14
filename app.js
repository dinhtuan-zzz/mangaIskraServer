import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import posts from "./routers/posts.js";
import auth from "./routers/auth.js";
import category from "./routers/category.js";
import search from "./routers/search.js";
import reply from './routers/reply.js'
import comments from './routers/comments.js'
import notifications from "./routers/notifications.js";
import messages from './routers/message.js'
import conversation from './routers/conversation.js'
import notiMessage from "./routers/notiMessage.js";
import { connect } from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import multer from "multer";
import { Server } from "socket.io";
//import { v2 as cloudinary } from 'cloudinary'
dotenv.config();
const app = express();
const PORT = process.env.APP_PORT;
// cloudinary.config({
//   cloud_name: 'trumblogapp',
//   api_key: '228477458325852',
//   api_secret: 'Fp5C-5r0nBs120YcwkiLCDkiphU'
// });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
connect();
app.use(bodyParser.json({ extended: true, limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));

app.use(cors());
app.use("/api/v1/posts", posts);
app.use("/api/v1/auth", auth);
app.use("/api/v1/category", category);
app.use("/api/v1/search/", search);
app.use('/api/v1/comment/', comments)
app.use('/api/v1/reply/', reply)
app.use('/api/v1/messages/', messages)
app.use('/api/v1/conversation/', conversation)
app.use("/api/v1/notifications/", notifications);
app.use("/api/v1/notimes/", notiMessage);
app.set("view engine", "pug");
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});
app.all("*", (req, res, next) => {
  const err = new Error("404 NOT FOUND");
  err.statusCode = 404;
  next(err);
});
app.use(errorHandler);
const io =new Server(8900, {
  cors: {
    origin: "https://mangaiskra.onrender.com:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("Connected.");
  socket.on("addUser", (userId) => {  
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });
  socket.on("disconnect", () => {
    console.log("Disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
//static folder
