"use client";
import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Nexus AI online. How can I assist with resource allocation today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Connection error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="glass-panel animate-fade-in" style={{
          width: '350px', height: '450px', marginBottom: '16px', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{animation: 'pulse 2s infinite'}}>◉</span> Nexus AI
            </div>
            <button onClick={toggleChat} style={{background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px'}}>✕</button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.08)',
                padding: '10px 14px',
                borderRadius: '12px',
                maxWidth: '85%',
                fontSize: '14px',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '12px',
                borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '12px',
              }}>
                {msg.text.split('**').map((part, i) => i % 2 !== 0 ? <strong key={i}>{part}</strong> : part)}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: '12px', fontSize: '14px', color: 'var(--text-secondary)'}}>
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} style={{ padding: '12px', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask for recommendations..."
              style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '14px' }}
            />
            <button type="submit" className="btn btn-primary" style={{padding: '10px'}} disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={toggleChat}
        style={{
          width: '60px', height: '60px', borderRadius: '30px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 20px var(--accent-blue-glow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        ✨
      </button>
    </div>
  );
}
