const messages = {
  '0': [],
};

const aliases = {
  '0': "First chat",
};

let currentChat = null;
const API_URL = "https://brainy-cyndie-infinitymagicstudios-2635fc96.koyeb.app/chat";

// Popup function
function popup(message) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '9999';

  const popupContainer = document.createElement('div');
  popupContainer.style.position = 'fixed';
  popupContainer.style.top = '50%';
  popupContainer.style.left = '50%';
  popupContainer.style.transform = 'translate(-50%, -50%)';
  popupContainer.style.backgroundColor = 'white';
  popupContainer.style.padding = '20px';
  popupContainer.style.borderRadius = '10px';
  popupContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  popupContainer.style.zIndex = '10000';
  popupContainer.style.display = 'flex';
  popupContainer.style.flexDirection = 'column';
  popupContainer.style.alignItems = 'center';
  popupContainer.style.justifyContent = 'center';

  const messageText = document.createElement('p');
  messageText.innerText = message;
  messageText.style.margin = '0 0 20px 0';
  messageText.style.fontSize = '16px';
  messageText.style.textAlign = 'center';

  const okButton = document.createElement('button');
  okButton.innerText = 'OK';
  okButton.style.padding = '10px 20px';
  okButton.style.border = 'none';
  okButton.style.backgroundColor = '#007BFF';
  okButton.style.color = 'white';
  okButton.style.borderRadius = '5px';
  okButton.style.cursor = 'pointer';

  okButton.addEventListener('click', () => {
    localStorage.setItem("accepted", 'true')
    document.body.removeChild(overlay);
  });
  
  popupContainer.appendChild(messageText);
  popupContainer.appendChild(okButton);
  overlay.appendChild(popupContainer);
  document.body.appendChild(overlay);
}

// Function to get id by alias
function getIdFromAlias(alias){
  for (const key in aliases) {
    if (aliases[key] === alias) {
      return key
    }
  }
}

// Function to select a chat
function selectChat(chatId) {
  currentChat = chatId;
  document.getElementById('chat-header').innerText = aliases[chatId];
  renderMessages();
}

// Modify chat buttons
function initializeChatButton(chat) {
  const openButton = document.createElement('button');
  openButton.innerText = 'Open';
  openButton.className = 'open-btn';
  openButton.onclick = () => showPopupMenu(chat.innerText, openButton);

  openButton.addEventListener('click', (event) => {
    event.stopPropagation();
  });
  chat.appendChild(openButton);
}

function initializeChatButtons() {
  const chatList = document.getElementById('chat-list');
  const chats = chatList.querySelectorAll('li');

  chats.forEach(chat => {
    initializeChatButton(chat);
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
    <li>Rename Chat</li>
    <li>Delete Chat</li>
  `;
  
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
      if (item.innerText === "Rename Chat") {
        document.querySelectorAll('li').forEach((item2) => {
          if (item2.innerText === popup.dataset.chatName) {
            renameChat(item2);
          }
        });
      } else if (item.innerText === "Delete Chat") {
        // Placeholder for delete chat logic
      }
      console.log(`"${item.innerText}" clicked!`);
      popup.remove();
      document.removeEventListener('click', closePopup);
    });
  });
}

// Function to rename chats
function renameChat(element) {
  const currentName = element.firstChild.nodeValue.trim();
  const savedFunction = element.getAttribute('onclick')

  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentName;
  input.className = 'rename-input';

  element.replaceWith(input);
  input.focus();

  input.addEventListener('blur', () => {
    const newName = input.value.trim() || originalElement.firstChild.nodeValue.trim();
    const updatedElement = document.createElement('li');
    updatedElement.textContent = newName;
    updatedElement.className = 'chat-name';
    updatedElement.setAttribute('onclick', savedFunction);

    input.replaceWith(updatedElement);
    initializeChatButton(updatedElement);

    const key = getKeyFromAlias(currentName);
    aliases[key] = newName;
    selectChat(key);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const newName = input.value.trim() || originalElement.firstChild.nodeValue.trim();
      const updatedElement = document.createElement('li');
      updatedElement.textContent = newName;
      updatedElement.className = 'chat-name';
      updatedElement.setAttribute('onclick', savedFunction);

      input.replaceWith(updatedElement);
      initializeChatButton(updatedElement);

      const key = getKeyFromAlias(currentName);
      aliases[key] = newName;
      selectChat(key);
    }
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

// Function to add a chat
function addChat() {
  const num = String(Object.keys(messages).length);
  messages[num] = [];
  aliases[num] = "New Chat";

  const chatList = document.getElementById('chat-list');
  const newChatItem = document.createElement('li');
  newChatItem.innerText = aliases[num];
  newChatItem.setAttribute('onclick', `selectChat('${num}')`);
  chatList.append(newChatItem);
  
  initializeChatButton(newChatItem);
}

// Function to delete a chat
function deleteChat(chatId) {
  delete messages[chatId];
  document.getElementById('chat-list').querySelectorAll('li').forEach((item) => {
    if (item.firstChild.nodeValue.trim() === chatId) {
      //d
    }
  });
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
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(requestPayload),
    });

    const responseData = await response.json();
    console.log("API Response Data:", responseData);
    
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
  if (localStorage.getItem("accepted") !== 'true') {
     popup("Welcome to ai-chat! Please note that your conversations aren't heavily secured and might be read by hackers. NEVER share sensitive info or passwords! Enjoy :)");
  }
  selectChat('0');
  initializeChatButtons();
};
