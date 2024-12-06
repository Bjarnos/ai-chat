print("js working")

const messages = {
  'Chat 1': [],
  'Chat 2': [],
  'Chat 3': []
};

let currentChat = null;
const API_URL = "https://brainy-cyndie-infinitymagicstudios-2635fc96.koyeb.app/chat";  // API endpoint updated to /chat

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

// Automatically set the default chat to "Chat 1" when the page loads
window.onload = function() {
  selectChat('Chat 1');
};
