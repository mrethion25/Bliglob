let messageHistory = []; // stores last 100 messages
const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
   socket.emit("messageHistory", messageHistory);
    console.log('Connected...')
socket.on("message", (msg) => {
    // save message
    messageHistory.push(msg);

    // keep only last 100
    if (messageHistory.length > 100) {
        messageHistory.shift();
    }

    // broadcast to others
    socket.broadcast.emit("message", msg);
});

})
