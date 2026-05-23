import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Eraser, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ChatbotWidget.css';
import { getAccessToken } from '../../../shared/utils/authToken';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; // Đảm bảo khớp với baseUrl của backend

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Khởi tạo session khi component render hoặc khi bấm clear
  const initSession = async () => {
    try {
      const token = getAccessToken();
      const response = await fetch(`${BASE_URL}/chatbot/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // Body có thể trống theo mô tả
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.id);
        setMessages([
          {
            id: 'welcome',
            role: 'bot',
            content: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?',
          },
        ]);
        
        // Nếu muốn load lại tin nhắn cũ (Option 3), gọi ở đây nếu lấy sessionId từ localStorage
      }
    } catch (error) {
      console.error('Lỗi khi khởi tạo session chatbot:', error);
    }
  };

  // Khởi tạo 1 lần khi render
  useEffect(() => {
    if (!sessionId) {
      initSession();
    }
  }, []);

  const handleClear = () => {
    setSessionId(null);
    setMessages([]);
    initSession();
  };

  // Hàm regex để dọn dẹp các mảng text của Function Calling bị leak từ Backend
  const cleanBotMessage = (text) => {
    if (!text) return '';
    return text.replace(/\(function=[a-zA-Z_0-9]+>[\s\S]*?<\/function>/gi, '').trim();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !sessionId || isLoading) return;

    const userMsg = inputValue.trim();
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const token = getAccessToken();
      const response = await fetch(`${BASE_URL}/chatbot/sessions/${sessionId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: userMsg }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'bot',
            content: cleanBotMessage(data.content) || 'Xin lỗi, tôi không thể trả lời lúc này.',
          },
        ]);
      } else {
        throw new Error('Lỗi từ server');
      }
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'bot',
          content: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Nút Toggle */}
      {!isOpen && (
        <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)}>
          <MessageSquare size={28} />
        </button>
      )}

      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <h3>
              <Bot size={20} /> Roomie AI 
            </h3>
            <div className="chatbot-header-actions">
              <button 
                className="chatbot-action-btn" 
                onClick={handleClear} 
                title="Tạo phiên mới"
              >
                <Eraser size={18} />
              </button>
              <button 
                className="chatbot-action-btn" 
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Danh sách tin nhắn */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbot-message ${msg.role}`}>
                {msg.role === 'bot' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form className="chatbot-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chatbot-input"
              placeholder="Nhập câu hỏi của bạn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="chatbot-send-btn" 
              disabled={!inputValue.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
