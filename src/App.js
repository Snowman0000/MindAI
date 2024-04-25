import logo from './logo.svg';
import './App.css';
import { useState } from "react";

async function App() {
  const API_KEY = process.env.OPEN_API_KEY;
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
    role: "system",
    content:
    "You're like a grammar-checking wizard, helping users fix grammar bloopers and jazz up their sentence structures.",
    },
  ]);

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        // We'll later replace the content with user input
        messages: [...messages, { "role": "user", "content": "This is a test!" }],
        temperature: 0.7,
      }),
    }
  );

  const chatData = async (userMessage) => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [...messages, { role: "user", content: userMessage }],
            temperature: 0.7,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Oops! Something went wrong while processing your request.");
      }
  
      const responseData = await response.json();
      setIsTyping(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: responseData.choices[0].message.content,
        },
      ]);
    } catch (error) {
      console.error("Error while fetching chat data:", error);
      setIsTyping(false);
    }
  };
  const handleSendMessage = (messageContent) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: messageContent },
    ]);
  //invoke chatData
    chatData(messageContent);
    setIsTyping(true);
  };

  return (
    <>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <h3>{message.role}</h3>
            <p>{message.content}</p>
          </div>
        ))}
        {isTyping && <p>Bot is typing...</p>}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.target.input.value;
          if (input.trim() !== "") {
            handleSendMessage(input);
            e.target.reset();
          }
        }}
      >
        <input
          type="text"
          name="input"
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={isTyping}
        >
          Send
        </button>
      </form>
    </>
  );
}

export default App;
