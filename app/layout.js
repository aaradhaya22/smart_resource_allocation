"use client";
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Chatbot from '@/components/Chatbot';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <aside className="sidebar">
            <div className="logo">
              <span style={{fontSize: "28px"}}>✦</span>
              <span className="gradient-text">NexusNGO</span>
            </div>
            
            <nav style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                <span className="icon">◈</span> Dashboard
              </Link>
              <Link href="/tasks" className={`nav-link ${pathname?.startsWith('/tasks') ? 'active' : ''}`}>
                <span className="icon">📋</span> Task Management
              </Link>
              <Link href="/volunteers" className={`nav-link ${pathname?.startsWith('/volunteers') ? 'active' : ''}`}>
                <span className="icon">👥</span> Volunteers
              </Link>
            </nav>
            
            <div style={{marginTop: 'auto', padding: '24px'}}>
              {mounted && (
                <button 
                  onClick={toggleTheme} 
                  className="btn btn-secondary" 
                  style={{width: '100%', marginBottom: '16px', display: 'flex', justifyContent: 'center', fontWeight: 'bold'}}
                >
                  {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
              )}
              <div 
                ref={dropdownRef}
                className="glass-panel" 
                style={{padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', position: 'relative'}}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div style={{width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff'}}>
                  A
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)'}}>Admin User</div>
                  <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>System Manager</div>
                </div>
                <div style={{color: 'var(--text-secondary)', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: '10px'}}>
                  ▼
                </div>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="glass-panel animate-fade-in" style={{
                    position: 'absolute', 
                    bottom: 'calc(100% + 12px)', 
                    left: 0, 
                    right: 0, 
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 50,
                    boxShadow: '0 -8px 32px rgba(0,0,0,0.4)'
                  }}>
                    <div style={{padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px'}} className="nav-link">
                      <span style={{fontSize: '16px'}}>👤</span> Profile
                    </div>
                    <div style={{padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px'}} className="nav-link">
                      <span style={{fontSize: '16px'}}>⚙️</span> Settings
                    </div>
                    <div style={{height: '1px', background: 'var(--border-glass)', margin: '4px 0'}}></div>
                    <div style={{padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '8px'}} className="nav-link">
                      <span style={{fontSize: '16px'}}>🚪</span> Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
          
          <main className="main-content">
            {children}
          </main>
          <Chatbot />
        </div>
      </body>
    </html>
  );
}
