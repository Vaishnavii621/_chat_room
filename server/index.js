const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connectDB");
const auth = require("./routes/userRoute");
const message = require("./routes/messagesRoute");
const { authUser } = require("./middlwares/authUser");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Use Render's PORT or fallback
const PORT = process.env.PORT || 5000;

// Dynamic CORS (for development)
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [] // In production, frontend served from same origin
    : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/v1/", auth);
app.use("/api/v1/chat/", authUser, message);

// Frontend (production)
const __dirname1 = path.resolve();
const frontendPath = path.join(__dirname1, "../client/dist");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  // Dev fallback
  app.get("*", (req, res) => {
    res.status(404).send("Frontend not built. Run `npm run build` in client/");
  });
}

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : "*",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);
  socket.emit("user-connected");

  socket.on("user-online", (user) => {
    if (user && !onlineUsers.includes(user)) {
      onlineUsers.push(user);
      io.emit("users-online", onlineUsers);
    }
  });

  socket.on("user-loggedout", (username) => {
    onlineUsers = onlineUsers.filter((usr) => usr !== username);
    io.emit("users-online", onlineUsers);
  });

  socket.on("send-message", (message) => {
    socket.broadcast.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user !== socket.id);
    io.emit("users-online", onlineUsers);
  });
});

// Connect DB & Start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
