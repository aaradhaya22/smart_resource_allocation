"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewVolunteerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSecondaryDropdown, setShowSecondaryDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skill: 'Medical',
    secondarySkills: [],
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
            className="primary-skill-select"
            style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '15px'}}
          >
            <option>Medical</option>
            <option>Food</option>
            <option>Logistics</option>
            <option>Education</option>
            <option>Shelter</option>
            <option>General</option>
          </select>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative'}}>
          <label style={{fontWeight: '500', fontSize: '14px', color: 'var(--text-secondary)'}}>Secondary Skills</label>
          <div 
            onClick={() => setShowSecondaryDropdown(!showSecondaryDropdown)}
            style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            <span style={{opacity: formData.secondarySkills.length > 0 ? 1 : 0.5}}>
              {formData.secondarySkills.length > 0 ? formData.secondarySkills.join(", ") : "Select skills..."}
            </span>
            <span style={{transform: showSecondaryDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', fontSize: '12px'}}>▼</span>
          </div>
          {showSecondaryDropdown && (
            <div style={{position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '8px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)'}}>
              {['Medical', 'Food', 'Logistics', 'Education', 'Shelter', 'General'].map(skill => (
                <label key={skill} style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', background: 'rgba(255,255,255,0.02)'}}>
                  <input 
                    type="checkbox" 
                    checked={formData.secondarySkills.includes(skill)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({...prev, secondarySkills: [...prev.secondarySkills, skill]}));
                      } else {
                        setFormData(prev => ({...prev, secondarySkills: prev.secondarySkills.filter(s => s !== skill)}));
                      }
                    }}
                    style={{width: '16px', height: '16px', accentColor: 'var(--accent-blue)', cursor: 'pointer'}}
                  />
                  <span style={{fontSize: '14px'}}>{skill}</span>
                </label>
              ))}
            </div>
          )}
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
