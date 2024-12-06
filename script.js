const messages = {
  'Chat 1': [],
  'Chat 2': [],
  'Chat 3': []
};

let currentChat = null;

// Function to select a chat
function selectChat(chatName) {
  currentChat = chatName;
  document.getElementById('chat-header').innerText = chatName;
  renderMessages();
}

// Function to render messages in the chat
function renderMessages() {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = '';
  if (currentChat && messages[currentChat]) {
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

// Add a new chat
function addChat() {
  const chatName = prompt('Enter a name for the new chat:');
  if (chatName && !messages[chatName]) {
    messages[chatName] = [];
    const chatList = document.getElementById('chat-list');
    const newChatItem = document.createElement('li');
    newChatItem.textContent = chatName;
    newChatItem.onclick = () => selectChat(chatName);
    chatList.appendChild(newChatItem);
    alert(`Chat "${chatName}" added!`);
  } else {
    alert('Chat name is invalid or already exists.');
  }
}

// Rename the current chat
function renameChat() {
  if (!currentChat) {
    alert('No chat selected to rename.');
    return;
  }
  const newChatName = prompt(`Enter a new name for "${currentChat}":`);
  if (newChatName && !messages[newChatName]) {
    messages[newChatName] = messages[currentChat];
    delete messages[currentChat];
    const chatItems = document.querySelectorAll('#chat-list li');
    chatItems.forEach(item => {
      if (item.textContent === currentChat) {
        item.textContent = newChatName;
        item.onclick = () => selectChat(newChatName);
      }
    });
    currentChat = newChatName;
    document.getElementById('chat-header').innerText = newChatName;
    alert(`Chat renamed to "${newChatName}".`);
  } else {
    alert('New chat name is invalid or already exists.');
  }
}

// Delete the current chat
function deleteChat() {
  if (!currentChat) {
    alert('No chat selected to delete.');
    return;
  }
  if (confirm(`Are you sure you want to delete "${currentChat}"?`)) {
    delete messages[currentChat];
    const chatItems = document.querySelectorAll('#chat-list li');
    chatItems.forEach(item => {
      if (item.textContent === currentChat) {
        item.remove();
      }
    });
    currentChat = null;
    document.getElementById('chat-header').innerText = 'Select a Chat';
    document.getElementById('chat-messages').innerHTML = '';
    alert('Chat deleted.');
  }
}

// Redirect to Google
function redirectToGoogle() {
  window.location.href = 'https://google.com';
}
