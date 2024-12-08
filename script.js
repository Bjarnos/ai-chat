const messages = {
  '1': [],
};

let currentChat = null;
const API_URL = "https://brainy-cyndie-infinitymagicstudios-2635fc96.koyeb.app/chat";

// Function to select a chat
function selectChat(chatName) {
  currentChat = chatName;
  document.getElementById('chat-header').innerText = chatName;
  renderMessages();
}

// Modify chat buttons
function initializeChatButtons() {
  const chatList = document.getElementById('chat-list');
  const chats = chatList.querySelectorAll('li');

  chats.forEach(chat => {
    const openButton = document.createElement('button');
    openButton.innerText = 'Open';
    openButton.className = 'open-btn';
    openButton.onclick = () => showPopupMenu(chat.innerText, openButton);
    chat.appendChild(openButton);
  });
}

// Function to show the popup
function showPopupMenu(chatName, button) {
  let existingPopup = document.querySelector('.popup-menu');
  if (existingPopup && existingPopup.dataset.chatName === chatName) {
    existingPopup.remove();
    return;
  }

  if (existingPopup) existingPopup.remove();

  const popup = document.createElement('ul');
  popup.className = 'popup-menu';
  popup.dataset.chatName = chatName;
  popup.innerHTML = `
    <li>Rename "${chatName}"</li>
    <li>Delete chat</li>
  `;

  popup.addEventListener('click', (event) => {
    event.stopPropagation();
  });
  
  const rect = button.getBoundingClientRect();
  popup.style.top = `${rect.bottom + window.scrollY}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;

  document.body.appendChild(popup);

  const closePopup = (event) => {
    if (!popup.contains(event.target) && event.target !== button) {
      popup.remove();
      document.removeEventListener('click', closePopup);
    }
  };

  document.addEventListener('click', closePopup);

  popup.querySelectorAll('li').forEach((item) => {
    item.addEventListener('click', () => {
      console.log(`${item.innerText} clicked!`);
      popup.remove();
      document.removeEventListener('click', closePopup);
    });
  });
}

// Function to render messages in the chat
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

// Function to send a message
function sendMessage() {
  const input = document.getElementById('message-input');
  const text = input.value.trim();
  if (text && currentChat) {
    messages[currentChat].push({ text, sent: true });
    input.value = '';  // Clear the input field
    renderMessages();  // Re-render the messages
    simulateAIResponse(text);  // Call the AI to simulate a response
  }
}

// Function to handle key press for Enter (send message) and Shift + Enter (new line)
function handleKeyDown(event) {
  const input = document.getElementById('message-input');
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // Prevent adding a newline
    sendMessage();
  }
}

// Function to simulate AI response by making an HTTP request
async function simulateAIResponse(userMessage) {
  const chatHistory = messages[currentChat];
  const maxHistoryLength = 10;
  
  // Get the last 10 messages, ensuring we send only recent history
  const historyToSend = chatHistory.slice(-maxHistoryLength);
  
  // Prepare the system message and user messages to send to the AI
  const systemMessage = {
    role: "system",
    content: "You are an AI assistant. Answer concisely and helpfully."
  };

  const userMessages = historyToSend.map(msg => ({
    role: msg.sent ? "user" : "assistant",
    content: msg.text
  }));

  // Send a request to the API with the chat history and new message
  const requestPayload = {
    messages: [systemMessage, ...userMessages, { role: "user", content: userMessage }]
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Add CORS header here
      },
      body: JSON.stringify(requestPayload),
    });

    const responseData = await response.json();
    console.log("API Response Data:", responseData);
    
    // Assuming the response has a 'response' field for the AI's reply
    if (responseData && responseData.response) {
      messages[currentChat].push({ text: responseData.response, sent: false });
      renderMessages();
    } else {
      console.error("Error: AI response did not contain the 'response' field.");
    }
  } catch (error) {
    console.error("Error calling the AI API:", error);
  }
}

// Page load functions
window.onload = function() {
  selectChat('Chat 1');
  initializeChatButtons();
};
