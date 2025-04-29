// src/components/Chat.jsx
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Your backend URL

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const msgData = {
        content: message,
        sender: 'User', // Can later be dynamic (e.g. username/email)
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit('sendMessage', msgData);
      setMessages((prev) => [...prev, msgData]);
      setMessage('');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Real-Time Chat</h2>
      <div className="h-64 overflow-y-auto border p-3 rounded bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <div className="text-sm text-gray-600">{msg.sender} @ {msg.timestamp}</div>
            <div className="bg-blue-100 text-gray-800 px-3 py-1 rounded w-fit max-w-full">
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
