import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const MedChat = () => {
  const { token } = useContext(AppContext);

  const questions = [
    "What is your name?",
    "How old are you?",
    "Do you have any chronic diseases?",
    "Are you on medication?",
    "Briefly describe your symptoms:"
  ];

  const [messages, setMessages] = useState([
    { text: "🤖 Welcome to MedChat - your AI medical assistant!", type: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [isQuestionnaireActive, setIsQuestionnaireActive] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    const container = messagesEndRef.current?.parentNode;
    if (container) container.scrollTop = container.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isQuestionnaireActive && currentQuestionIndex === 0 && messages.length === 1) {
      setTimeout(() => {
        setMessages(prev => [...prev, { text: questions[0], type: 'bot' }]);
      }, 1000);
    }
  }, [isQuestionnaireActive]);

  const sendToBackend = async (userResponses) => {
    setLoading(true);
    try {
      const name = userResponses[0]?.answer || "";
      const age = userResponses[1]?.answer || "";
      const chronic = userResponses[2]?.answer || "";
      const meds = userResponses[3]?.answer || "";
      const symptoms = userResponses[4]?.answer || "";

      const payload = {
        data: [
          symptoms,
          `Name: ${name}\nAge: ${age}\nChronic diseases: ${chronic}\nMedications: ${meds}`
        ]
      };

      const response = await axios.post(
        "https://medical-be-u2v7.onrender.com/api/chat-with-history",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = response.data;

      return {
        status: 'success',
        reply: typeof result === 'string'
          ? result
          : result?.gemini_response || JSON.stringify(result)
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        status: 'error',
        message: error?.response?.data?.message || 'Failed to connect to the server.'
      };
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, type: 'user' };
    setMessages(prev => [...prev, userMessage]);

    if (isQuestionnaireActive) {
      const newResponses = [...userResponses, {
        question: questions[currentQuestionIndex],
        answer: input
      }];
      setUserResponses(newResponses);

      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setTimeout(() => {
          setMessages(prev => [...prev, { text: questions[nextIndex], type: 'bot' }]);
        }, 500);
      } else {
        const backendResponse = await sendToBackend(newResponses);
        if (backendResponse.status === 'success') {
          setIsQuestionnaireActive(false);
          setMessages(prev => [...prev, { text: backendResponse.reply, type: 'bot' }]);
        } else {
          setMessages(prev => [...prev, {
            text: `Error: ${backendResponse.message || 'Something went wrong.'}`,
            type: 'bot'
          }]);
        }
      }
   } else {
  setLoading(true);
  try {
    const payload = {
      data: [input, "Follow-up question from the user."]
    };

    const response = await axios.post(
      "https://medical-be-u2v7.onrender.com/api/chat-with-history",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const reply = typeof response.data === 'string'
      ? response.data
      : response.data?.gemini_response || JSON.stringify(response.data);

    setMessages(prev => [...prev, { text: reply, type: 'bot' }]);
  } catch (err) {
    setMessages(prev => [...prev, {
      text: 'Error connecting to the server.',
      type: 'bot'
    }]);
  }
  setLoading(false);
}


    setInput('');
  };

  const handleNewChat = () => {
    setMessages([{ text: "🤖 Welcome to MedChat - your AI medical assistant!", type: 'bot' }]);
    setCurrentQuestionIndex(0);
    setUserResponses([]);
    setIsQuestionnaireActive(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: questions[0], type: 'bot' }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[80vh] max-h-[700px]">

<div className="bg-[var(--primary)] px-6 py-4 flex justify-between items-center">
  <h1 className="text-xl font-bold text-white">MedChat AI Assistant</h1>
  <div className="flex gap-2">
    <button
      onClick={handleNewChat}
      className="bg-white text-[var(--primary)] px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
    >
      New Chat
    </button>
    <a
      href="/doctors"
      className="bg-white text-[var(--primary)] px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
    >
      Book Appointment
    </a>
  </div>
</div>


        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.type === 'user'
                  ? 'bg-[var(--primary)] text-white rounded-tr-none'
                  : 'bg-white text-gray-800 shadow-sm rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white text-gray-800 shadow-sm px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%]">
                <div className="flex items-center text-gray-500">
                  <div className="h-2 w-2 bg-gray-400 rounded-full mr-1 animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden">
            <input
              type="text"
              className="flex-1 px-4 py-3 focus:outline-none"
              placeholder={
                isQuestionnaireActive
                  ? `Answer: ${questions[currentQuestionIndex]}`
                  : "Type your message here..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className={`bg-[var(--primary)] text-white px-6 py-3 font-medium transition ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedChat;
