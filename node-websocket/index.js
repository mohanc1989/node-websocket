const express = require("express");
const http = require("http");
const { Server } = require("socket.io"); 
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

app.get("/", (req, res) => {
    res.json({ "msg": "Hello node express learning" });
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // FIXED: Changed 'joint-chat' to 'join-chat'
    socket.on('join-chat', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on('send-message', (data) => {
        console.log("Broadcasting message to room:", data.roomId);
        // Using io.to ensures everyone in the room (including sender) sees it
        socket.to(data.roomId).emit('receive-message', {
            sender: socket.id,
            text: data.message
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
