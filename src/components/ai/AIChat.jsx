import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { getAIChatResponse } from '../../utils/aiService';
import { getRAGContext } from '../../utils/ragUtils';
import './AIChat.css';

const AIChat = ({ currentData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hello! I am your Aquasentinel AI. How can I help you manage your water today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const context = getRAGContext(currentData);
            const response = await getAIChatResponse(userMsg, messages, context);
            setMessages(prev => [...prev, { role: 'assistant', text: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I'm having trouble responding right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`ai-chat-wrapper ${isOpen ? 'open' : ''}`}>
            {!isOpen && (
                <button className="chat-trigger pulse-button" onClick={() => setIsOpen(true)}>
                    <MessageSquare size={24} />
                    <span className="badge">AI Online</span>
                </button>
            )}

            {isOpen && (
                <div className="chat-window shadow-premium">
                    <header className="chat-header">
                        <div className="bot-info">
                            <Bot className="bot-icon" />
                            <div>
                                <h3>Water Intelligence Chat</h3>
                                <span className="status">Online & Analyzing</span>
                            </div>
                        </div>
                        <button className="close-chat" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </header>

                    <div className="messages-container">
                        {messages.map((msg, i) => (
                            <div key={i} className={`message-row ${msg.role}`}>
                                <div className="avatar">
                                    {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                                </div>
                                <div className="message-bubble">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message-row assistant">
                                <div className="avatar"><Bot size={14} /></div>
                                <div className="message-bubble loading">
                                    <Loader2 className="spin" size={16} />
                                    Analyzing system state...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-area" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Ask me anything about your water system..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={!input.trim() || isLoading}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIChat;
