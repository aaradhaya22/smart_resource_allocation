"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewVolunteerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skill: 'Medical',
    location: '',
    isAvailable: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await fetch('/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    router.push('/volunteers');
  };

  return (
    <div className="animate-fade-in" style={{maxWidth: '600px', margin: '0 auto'}}>
      <header className="page-header" style={{marginBottom: '24px'}}>
        <div>
          <Link href="/volunteers" style={{color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-block', marginBottom: '8px'}}>← Back to Volunteers</Link>
          <h1 className="gradient-text">Register Volunteer</h1>
        </div>
      </header>

      <form className="glass-panel" onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <label style={{fontWeight: '500', fontSize: '14px', color: 'var(--text-secondary)'}}>Full Name</label>
          <input 
            type="text" 
            required 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '15px'}}
            placeholder="e.g. Dr. Sarah Chen"
          />
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <label style={{fontWeight: '500', fontSize: '14px', color: 'var(--text-secondary)'}}>Primary Skill / Category</label>
          <select 
            value={formData.skill}
            onChange={e => setFormData({...formData, skill: e.target.value})}
            style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-secondary)', color: '#fff', fontSize: '15px'}}
          >
            <option>Medical</option>
            <option>Food</option>
            <option>Logistics</option>
            <option>Education</option>
            <option>Shelter</option>
            <option>General</option>
          </select>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <label style={{fontWeight: '500', fontSize: '14px', color: 'var(--text-secondary)'}}>Base Location</label>
          <input 
            type="text" 
            required 
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '15px'}}
            placeholder="e.g. Downtown Shelter"
          />
        </div>

         <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px'}}>
          <input 
            type="checkbox" 
            id="available"
            checked={formData.isAvailable}
            onChange={e => setFormData({...formData, isAvailable: e.target.checked})}
            style={{width: '18px', height: '18px', accentColor: 'var(--accent-blue)'}}
          />
          <label htmlFor="available" style={{fontWeight: '500', fontSize: '15px', cursor: 'pointer'}}>Currently Available for Deployment</label>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px'}}>
          <Link href="/volunteers" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Processing...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
}
