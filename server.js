let messageHistory = []; // stores last 100 messages
const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

// Allow JSON (needed for bot API)
app.use(express.json());

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Socket
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('Connected...');

    // Send history when user joins
    socket.emit("messageHistory", messageHistory);

    socket.on("message", (msg) => {

        messageHistory.push(msg);
        if (messageHistory.length > 100) {
            messageHistory.shift();
        }

        // send to all users
        socket.broadcast.emit("message", msg);
    });
});

/* ================= BOT HTTP API =================== */

// Bot sends a message
app.post("/bot/send", (req, res) => {
    const { user, message } = req.body;

    if (!user || !message) {
        return res.status(400).json({ error: "Missing user or message" });
    }

    const msg = { user, message };

    messageHistory.push(msg);
    if (messageHistory.length > 100) messageHistory.shift();

    io.emit("message", msg);

    console.log(`🤖 BOT SENT → ${message}`);

    res.json({ success: true });
});

// Bot reads last messages
app.get("/bot/history", (req, res) => {
    res.json(messageHistory.slice(-100));
});
