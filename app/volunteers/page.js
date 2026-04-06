"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/volunteers')
      .then(res => res.json())
      .then(data => {
        setVolunteers(data);
        setLoading(false);
      });
  }, []);

  const deleteVolunteer = async (id) => {
    if (window.confirm("Are you sure you want to remove this volunteer?")) {
      try {
        const res = await fetch(`/api/volunteers/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setVolunteers(volunteers.filter(vol => vol.id !== id));
        }
      } catch (error) {
        console.error("Failed to delete volunteer", error);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">Volunteer Network</h1>
          <p style={{color: 'var(--text-secondary)', marginTop: '8px'}}>Manage community members, skills, and availability.</p>
        </div>
        <Link href="/volunteers/new" className="btn btn-primary">
          <span>+</span> Add Volunteer
        </Link>
      </header>

      <div className="glass-panel animate-fade-in delay-1" style={{padding: '0', overflow: 'hidden'}}>
        {loading ? (
          <div style={{padding: '40px', textAlign: 'center', color: 'var(--text-secondary)'}}>Loading personnel...</div>
        ) : volunteers.length === 0 ? (
          <div style={{padding: '40px', textAlign: 'center', color: 'var(--text-secondary)'}}>No volunteers registered yet.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Primary Skill</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((vol) => (
                <tr key={vol.id}>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <div style={{width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', color: '#fff'}}>
                        {vol.name.charAt(0)}
                      </div>
                      <div style={{fontWeight: '600'}}>{vol.name}</div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-medium" style={{background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)'}}>{vol.skill}</span>
                  </td>
                  <td>{vol.location}</td>
                  <td>
                    {vol.isAvailable ? (
                      <span className="badge badge-low">Available</span>
                    ) : (
                      <span className="badge badge-critical">Deployed / Unavailable</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      style={{padding: '6px 12px', fontSize: '13px', borderColor: 'var(--accent-red)', color: 'var(--accent-red)'}}
                      onClick={() => deleteVolunteer(vol.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
