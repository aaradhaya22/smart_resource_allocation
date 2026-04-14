"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const apiCache = {
  countries: null,
  states: {},
  cities: {}
};

async function fetchCountries() {
  if (apiCache.countries) return apiCache.countries;
  try {
    const res = await fetch('https://countriesnow.space/api/v0.1/countries');
    if (!res.ok) throw new Error();
    const data = await res.json();
    const sorted = data.data.map(c => c.country).sort((a, b) => a.localeCompare(b));
    apiCache.countries = sorted;
    return sorted;
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function fetchStates(country) {
  if (!country) return [];
  if (apiCache.states[country]) return apiCache.states[country];
  try {
    const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country })
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    const states = data?.data?.states?.map(s => s.name) || [];
    apiCache.states[country] = states;
    return states;
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function fetchCities(country, state) {
  if (!country || !state) return [];
  const key = `${country}-${state}`;
  if (apiCache.cities[key]) return apiCache.cities[key];
  try {
    const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country, state })
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    const cities = data?.data || [];
    apiCache.cities[key] = cities;
    return cities;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Medical',
    status: 'Pending',
    affectedCount: ''
  });

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    setLoadingLocation(true);
    setLocationError(false);
    fetchCountries().then(c => {
      setCountriesList(c);
      if (c.length === 0) setLocationError(true);
      setLoadingLocation(false);
    });
  }, []);

  useEffect(() => {
    setSelectedState('');
    setSelectedCity('');
    setStatesList([]);
    setCitiesList([]);
    if (selectedCountry) {
      setLoadingLocation(true);
      setLocationError(false);
      fetchStates(selectedCountry).then(s => {
        setStatesList(s);
        if (s.length === 0) setLocationError(true);
        setLoadingLocation(false);
      });
    }
  }, [selectedCountry]);

  useEffect(() => {
    setSelectedCity('');
    setCitiesList([]);
    if (selectedCountry && selectedState) {
      setLoadingLocation(true);
      setLocationError(false);
      fetchCities(selectedCountry, selectedState).then(c => {
        setCitiesList(c);
        if (c.length === 0) setLocationError(true);
        setLoadingLocation(false);
      });
    }
  }, [selectedState, selectedCountry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const fullLocation = `${selectedCity}, ${selectedState}, ${selectedCountry}`;
    
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, location: fullLocation })
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
            <label style={{fontWeight: '500', fontSize: '14px', color: 'var(--text-secondary)'}}>
              Country {loadingLocation && <span style={{fontSize:'12px', color:'var(--accent-blue)'}}>(Loading...)</span>}
              {locationError && <span style={{fontSize:'12px', color:'var(--accent-red)'}}>(Failed to load data)</span>}
            </label>
            <select 
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-glass)', color: 'var(--text-primary)', fontSize: '15px'}}
            >
              <option value="">Select Country</option>
              {countriesList.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontWeight: '500', fontSize: '14px', color: 'var(--text-secondary)'}}>State</label>
            <select 
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              disabled={!selectedCountry}
              style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-glass)', color: 'var(--text-primary)', fontSize: '15px'}}
            >
              <option value="">Select State</option>
              {statesList.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontWeight: '500', fontSize: '14px', color: 'var(--text-secondary)'}}>City</label>
            <select 
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              disabled={!selectedState}
              style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-glass)', color: 'var(--text-primary)', fontSize: '15px'}}
            >
              <option value="">Select City</option>
              {citiesList.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
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

          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
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
