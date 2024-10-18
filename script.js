const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// API Key
const API_KEY = 'f0a31e7521707f0f11aae8cef5f5b877.dt32i3rY9SCNhMY7';

function addMessage(content, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'ai-message');
    messageElement.textContent = content;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function callAIAPI(userMessage) {
    const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    };
    const data = {
        "model": "glm-4",
        "messages": [
            {
                "role": "user",
                "content": userMessage
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.choices[0].message.content;
    } catch (error) {
        console.error('API调用出错:', error);
        return '抱歉,我现在无法回答。请稍后再试。';
    }
}

async function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessage(userMessage, true);
        userInput.value = '';
        
        const aiResponse = await callAIAPI(userMessage);
        addMessage(aiResponse, false);
    }
}

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});
