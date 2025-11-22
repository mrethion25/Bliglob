let messageHistory = []; // stores last 100 messages
const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

// Start server
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// Serve static files
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Socket.io setup
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('Connected…');

    // Send message history to new user
    socket.emit("messageHistory", messageHistory);

    socket.on("message", (msg) => {

        // Save message
        messageHistory.push(msg);

        // Keep last 100
        if (messageHistory.length > 100) {
            messageHistory.shift();
        }

        // Broadcast to all EXCEPT sender
        socket.broadcast.emit("message", msg);
    });
});
