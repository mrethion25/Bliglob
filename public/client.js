const socket = io()
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
let name = "";

// Show modal
const modal = document.getElementById("usernameModal");
const input = document.getElementById("usernameInput");
const submitBtn = document.getElementById("usernameSubmit");

// On button click
submitBtn.addEventListener("click", () => {
    const username = input.value.trim();
    if (username.length > 0) {
        name = username;
        modal.style.display = "none";   // hide modal
    }
});

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 

// 1️⃣ RECEIVE HISTORY FIRST (last 100 messages)
socket.on("messageHistory", (history) => {
    history.forEach(msg => {
        appendMessage(msg, "incoming");
    });
});

// 2️⃣ THEN RECEIVE LIVE MESSAGES
socket.on("message", (msg) => {
    appendMessage(msg, "incoming");
});

// 3️⃣ YOUR SEND MESSAGE CODE HERE
textarea.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && textarea.value.trim() !== "") {
        sendMessage(textarea.value);
        textarea.value = "";
    }
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}

// THEME SWITCHING
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});

// SEND BUTTON SUPPORT
const sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener("click", () => {
    let message = textarea.value.trim();
    if (message.length > 0) {
        sendMessage(message); // already exists in your code
        textarea.value = "";
    }
});
