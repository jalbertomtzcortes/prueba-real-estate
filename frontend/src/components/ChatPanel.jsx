import React from "react";

import { useState } from "react";
import axios from "axios";

export default function ChatPanel() {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const sendMessage = async () => {

    const res = await axios.post(
      "http://localhost:4000/api/ai",
      { question: text }
    );

    setMessages([
      ...messages,
      { sender: "user", text },
      { sender: "bot", text: res.data.reply }
    ]);

    setText("");

  };

  return (

    <div>

      {messages.map((m, i) => (
        <div key={i}>
          <b>{m.sender}</b>: {m.text}
        </div>
      ))}

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={sendMessage}>
        enviar
      </button>

    </div>

  );
}