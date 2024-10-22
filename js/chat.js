// Socket.IOサーバーに接続
const socket = io('http://localhost:3000');
const chatHistoryElement = document.getElementById('chatHistory');
const sendButton = document.getElementById('sendButton');
const resultElement = document.getElementById('result');

// メッセージ送信
sendButton.addEventListener('click', () => {
    const message = resultElement.value;
    socket.emit('chat message', message); // サーバーに送信

    addMyChatHistory(message);

    resultElement.value = '';
});

// サーバーからメッセージを受信
socket.on('chat message', (msg) => {
    sender = "user1"
    addOtherChatHistory(msg, sender);
});

const addMyChatHistory = (message, sender) => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('flex', 'justify-end', 'my-2');

    const messageBubble = document.createElement('div');
    messageBubble.classList.add('bg-teal-500', 'text-white', 'rounded-lg', 'p-3', 'max-w-xs', 'text-left');
    messageBubble.innerHTML = message;

    messageDiv.appendChild(messageBubble);
    chatHistoryElement.appendChild(messageDiv);
};

const addOtherChatHistory = (message, sender) => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('flex', 'justify-start', 'my-2');

    const messageBubble = document.createElement('div');
    messageBubble.classList.add('bg-gray-300', 'text-gray-800', 'rounded-lg', 'p-3', 'max-w-xs', 'text-left');
    messageBubble.innerHTML = `<strong>${sender}:</strong> ${message}`;

    messageDiv.appendChild(messageBubble);
    chatHistoryElement.appendChild(messageDiv);
};