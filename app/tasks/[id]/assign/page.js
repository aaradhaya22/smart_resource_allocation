"use client";
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AssignTaskPage({ params }) {
  const router = useRouter();
  // Unwrap params using React 19 / Next 15 `use` hook
  const { id } = use(params);
  
  const [task, setTask] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);

  useEffect(() => {
    // Fetch Task
    fetch('/api/tasks')
      .then(res => res.json())
      .then(tasks => {
        const t = tasks.find(x => x.id === id);
        setTask(t);
      });

    // Fetch Matches
    fetch(`/api/tasks/${id}/match`)
      .then(res => res.json())
      .then(data => {
        setMatches(data);
        setLoading(false);
      });
  }, [id]);

  const handleAssign = async (volunteerId) => {
    setAssigning(volunteerId);
    await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: id, volunteerId })
    });
    router.push('/tasks');
  };

  if (loading) return (
    <div style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
       <div className="gradient-text" style={{fontSize: '24px', animation: 'pulse 2s infinite'}}>Running AI Matching Algorithm...</div>
    </div>
  );

  if (!task) return <div>Task not found.</div>;

  return (
    <div className="animate-fade-in" style={{maxWidth: '900px', margin: '0 auto'}}>
      <header className="page-header" style={{marginBottom: '24px'}}>
        <div>
          <Link href="/tasks" style={{color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-block', marginBottom: '8px'}}>← Back to Tasks</Link>
          <h1 className="gradient-text">Smart Volunteer Assign</h1>
        </div>
      </header>

      {/* Task Context */}
      <div className="glass-panel" style={{marginBottom: '32px', borderLeft: task.urgency === 'Critical' ? '4px solid var(--accent-red)' : '4px solid var(--accent-blue)'}}>
        <h2 style={{fontSize: '20px', marginBottom: '8px'}}>{task.title}</h2>
        <div style={{display: 'flex', gap: '24px', fontSize: '14px', color: 'var(--text-secondary)'}}>
          <span><strong>Category:</strong> {task.category}</span>
          <span><strong>Location:</strong> {task.location}</span>
          <span><strong>Urgency:</strong> {task.urgency}</span>
          <span><strong>Priority AI Score:</strong> {task.priority}</span>
        </div>
      </div>

      <h3 style={{marginBottom: '16px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px'}}>
        <span>✨</span> AI Recommended Matches
      </h3>
      
      {matches.length === 0 ? (
        <div className="glass-panel" style={{textAlign: 'center', padding: '40px', color: 'var(--text-secondary)'}}>
          No available volunteers found. Please add more volunteers to the network.
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {matches.map((vol, idx) => (
            <div key={vol.id} className={`glass-panel animate-fade-in delay-${(idx % 3) + 1}`} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              
              <div style={{display: 'flex', gap: '24px', alignItems: 'center'}}>
                {/* Score Circular Badge */}
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%', 
                  background: `conic-gradient(var(--accent-green) ${vol.matchScore}%, var(--bg-primary) 0)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                }}>
                  <div style={{width: '56px', height: '56px', background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px'}}>
                    {vol.matchScore}
                  </div>
                </div>

                <div>
                  <h4 style={{fontSize: '18px', marginBottom: '4px'}}>{vol.name}</h4>
                  <div style={{fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '16px'}}>
                    <span>{vol.skill} Specialist</span>
                    <span>📍 {vol.location}</span>
                  </div>
                  
                  {vol.matchReasons && vol.matchReasons.length > 0 && (
                     <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
                       {vol.matchReasons.map((r, i) => (
                         <span key={i} className="badge badge-low" style={{fontSize: '11px'}}>{r}</span>
                       ))}
                     </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => handleAssign(vol.id)} 
                disabled={assigning !== null}
                className="btn btn-primary"
              >
                {assigning === vol.id ? 'Deploying...' : 'Assign & Deploy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
