"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'Medical',
    status: 'Pending',
    affectedCount: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    router.push('/tasks');
  };

  return (
    <div className="animate-fade-in" style={{maxWidth: '800px', margin: '0 auto'}}>
      <header className="page-header" style={{marginBottom: '24px'}}>
        <div>
          <Link href="/tasks" style={{color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-block', marginBottom: '8px'}}>← Back to Tasks</Link>
          <h1 className="gradient-text">Create New Task</h1>
        </div>
      </header>

      <form className="glass-panel" onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <label style={{fontWeight: '500', fontSize: '14px', color: 'var(--text-secondary)'}}>Task Title</label>
          <input 
            type="text" 
            required 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-glass)', color: 'var(--text-primary)', fontSize: '15px'}}
            placeholder="e.g. Emergency Medical Camp"
          />
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <label style={{fontWeight: '500', fontSize: '14px', color: 'var(--text-secondary)'}}>Description</label>
          <textarea 
            required 
            rows="3"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-glass)', color: 'var(--text-primary)', fontSize: '15px', fontFamily: 'inherit'}}
          ></textarea>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontWeight: '500', fontSize: '14px', color: 'var(--text-secondary)'}}>Location</label>
            <input 
              type="text" 
              required 
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-glass)', color: 'var(--text-primary)', fontSize: '15px'}}
            />
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontWeight: '500', fontSize: '14px', color: 'var(--text-secondary)'}}>Category</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '15px'}}
            >
              <option>Medical</option>
              <option>Food</option>
              <option>Logistics</option>
              <option>Education</option>
              <option>Shelter</option>
            </select>
          </div>

          {/* Urgency Level field removed */}

          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontWeight: '500', fontSize: '14px', color: 'var(--text-secondary)'}}>Number of People Affected</label>
            <input 
              type="number" 
              required 
              min="0"
              value={formData.affectedCount}
              onChange={e => setFormData({...formData, affectedCount: e.target.value})}
              style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-glass)', color: 'var(--text-primary)', fontSize: '15px'}}
            />
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1'}}>
            <label style={{fontWeight: '500', fontSize: '14px', color: 'var(--text-secondary)'}}>Status</label>
            <select 
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '15px'}}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div style={{fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '8px'}}>
          * Task priority is automatically calculated based on category and impact
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px'}}>
          <Link href="/tasks" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Processing...' : 'Submit Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
