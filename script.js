const messages = {
  'Chat 1': [],
  'Chat 2': [],
  'Chat 3': []
};

let currentChat = null;

function selectChat(chatName) {
  currentChat = chatName;
  document.getElementById('chat-header').innerText = chatName;
  renderMessages();
}

function renderMessages() {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = '';
  if (currentChat) {
    messages[currentChat].forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${msg.sent ? 'sent' : 'received'}`;
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.innerText = msg.text;
      messageDiv.appendChild(bubble);
      chatMessages.appendChild(messageDiv);
    });
  }
}

function sendMessage() {
  const input = document.getElementById('message-input');
  const text = input.value.trim();
  if (text && currentChat) {
    messages[currentChat].push({ text, sent: true });
    input.value = '';
    renderMessages();
    simulateAIResponse();
  }
}

function simulateAIResponse() {
  setTimeout(() => {
    if (currentChat) {
      messages[currentChat].push({ text: "This is an AI response.", sent: false });
      renderMessages();
    }
  }, 1000);
}
