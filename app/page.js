"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
      <div className="gradient-text" style={{fontSize: '24px', animation: 'pulse 2s infinite'}}>Loading Insights...</div>
    </div>
  );

  const totalTasks = Object.values(stats.tasksByUrgency).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">Global Overview</h1>
          <p style={{color: 'var(--text-secondary)', marginTop: '8px'}}>AI-powered resource insights and telemetry.</p>
        </div>
        <Link href="/tasks/new" className="btn btn-primary">
          <span>+</span> Create Task
        </Link>
      </header>

      <div className="stats-grid animate-fade-in delay-1">
        <div className="glass-panel stat-card critical">
          <div className="stat-title">Critical Attention Needed</div>
          <div className="stat-value" style={{color: 'var(--accent-red)'}}>
            {stats.criticalTasks} <span>tasks</span>
          </div>
          <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px'}}>Priority scores &gt;80</p>
        </div>
        
        <div className="glass-panel stat-card">
          <div className="stat-title">Active Field Tasks</div>
          <div className="stat-value" style={{color: 'var(--accent-blue)'}}>
            {stats.activeTasks}
          </div>
        </div>

        <div className="glass-panel stat-card success">
          <div className="stat-title">Available Volunteers</div>
          <div className="stat-value" style={{color: 'var(--accent-green)'}}>
            {stats.totalVolunteers}
          </div>
        </div>
      </div>

      <div className="stats-grid animate-fade-in delay-2" style={{gridTemplateColumns: '1fr 1fr'}}>
        <div className="glass-panel">
          <h3 style={{marginBottom: '24px', fontSize: '18px'}}>Task Urgency Distribution</h3>
          <div className="chart-container">
            <div className="bar-wrapper">
              <div className="bar" style={{height: `${(stats.tasksByUrgency.Critical || 0 + stats.tasksByUrgency.High || 0) / totalTasks * 100}%`, background: 'var(--accent-red)', boxShadow: '0 0 16px rgba(239, 68, 68, 0.4)'}}></div>
              <span className="bar-label">High/Critical</span>
            </div>
            <div className="bar-wrapper">
              <div className="bar" style={{height: `${(stats.tasksByUrgency.Medium || 0) / totalTasks * 100}%`, background: 'var(--accent-orange)'}}></div>
              <span className="bar-label">Medium</span>
            </div>
            <div className="bar-wrapper">
              <div className="bar" style={{height: `${(stats.tasksByUrgency.Low || 0) / totalTasks * 100}%`, background: 'var(--accent-green)'}}></div>
              <span className="bar-label">Low</span>
            </div>
          </div>
        </div>

        <div className="glass-panel">
          <h3 style={{marginBottom: '24px', fontSize: '18px'}}>Task Requirements by Category</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {Object.entries(stats.taskCategories || {}).map(([cat, count]) => (
              <div key={cat} style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <div style={{width: '100px', fontSize: '14px', color: 'var(--text-secondary)'}}>{cat}</div>
                <div style={{flex: 1, background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${(count / totalTasks) * 100}%`, background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))', borderRadius: '4px'}}></div>
                </div>
                <div style={{width: '40px', textAlign: 'right', fontWeight: 'bold'}}>{count}</div>
              </div>
            ))}
            {Object.keys(stats.taskCategories || {}).length === 0 && (
              <div style={{color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '40px'}}>No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
