const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

let chatHistory = [];

// Function to add message to the chat history
function addMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(sender === "user" ? "user-message" : "ai-message");
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to handle sending the message
async function sendMessage() {
    const message = userInput.value;
    if (message.trim() === "") return;

    // Add user message to chat history
    addMessage("user", message);
    chatHistory.push({ sender: "user", message: message });

    // Clear the input field
    userInput.value = "";

    // Send the message to the Hugging Face API and get a response
    const response = await getAIResponse(message);
    
    // Add AI message to chat history
    addMessage("ai", response);
    chatHistory.push({ sender: "ai", message: response });
}

// Function to call the Hugging Face API for AI response
async function getAIResponse(message) {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer typeyourapikey',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: message
            })
        });

        const data = await response.json();
        return data.generated_text || "Sorry, I couldn't understand that.";
    } catch (error) {
        console.error('Error fetching AI response:', error);
        return "Sorry, something went wrong.";
    }
}
