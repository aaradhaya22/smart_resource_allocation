import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const locationMap = new Map(); // Simple cache

function normalize(str) {
  return str?.toLowerCase().trim();
}

async function getGeocodedLocation(locationStr) {
  if (locationMap.has(locationStr)) {
    return locationMap.get(locationStr);
  }
  
  try {
    // API Fallback (Geocoding - OpenCage/Mock)
    // Normally we'd call an API here. Mocking API behaviour.
    // e.g. const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationStr)}&key=YOUR_KEY`);
    const parts = locationStr.split(",").map(s => normalize(s));
    
    // Fill with empty strings if not enough parts
    while(parts.length < 4) parts.push('');
    const result = {
      area: parts[0],
      city: parts[1],
      state: parts[2],
      country: parts[3]
    };
    
    locationMap.set(locationStr, result);
    return result;
  } catch (err) {
    console.error("Geocoding failed", err);
    return null;
  }
}

function isLocationMatch(taskLocationStr, volunteerLocationStr) {
  if (!taskLocationStr || !volunteerLocationStr) return 0;
  
  const [tCity, tState, tCountry] = taskLocationStr.split(",").map(s => normalize(s));
  const [vCity, vState, vCountry] = volunteerLocationStr.split(",").map(s => normalize(s));

  // 1. Exact city match
  if (tCity && tCity === vCity) return 3;

  // 2. State match
  if (tState && tState === vState) return 2;

  // 3. Country match
  if (tCountry && tCountry === vCountry) return 1;

  return 0;
}

export async function GET(request, { params }) {
  try {
    // Await params in Next.js >= 15
    const { id } = await params;
    
    const tasks = await db.getTasks();
    const volunteers = await db.getVolunteers();
    
    const task = tasks.find(t => t.id === id);
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    
    // 1. Filter only available volunteers
    let availableVolunteers = volunteers.filter(v => v.isAvailable);
    
    // 2. Score them
    const scoredVolunteers = availableVolunteers.map(v => {
      let score = 0;
      let reasons = [];
      
      // Skill match
      if (v.skill.toLowerCase() === task.category.toLowerCase() || 
          (task.category.toLowerCase() === 'medical' && v.skill.toLowerCase().includes('doc'))) {
        score += 50;
        reasons.push("Strong Skill Match");
      } else if (v.skill.toLowerCase() === 'logistics' && task.category.toLowerCase() === 'food') {
        score += 20; // partial match for related skills
        reasons.push("Partial Skill Match (Logistics)");
      }
      
      const secondarySkills = v.secondarySkills || [];
      const hasSecondaryMatch = secondarySkills.some(s => s.toLowerCase() === task.category.toLowerCase());
      if (hasSecondaryMatch) {
        score += 15;
        reasons.push("Secondary Skill Match");
      }
      
      // Location match
      // If high urgency, prioritize closest available
      const isUrgent = task.urgency === 'High' || task.urgency === 'Critical';
      
      // Basic string match for location
      // Using new isLocationMatch logic
      let locationScore = 0;
      try {
        const matchLvl = isLocationMatch(task.location, v.location);
        // Integrate into Smart Match scoring based on match level
        if (matchLvl === 3) locationScore = 30; // City
        if (matchLvl === 2) locationScore = 20; // State
        if (matchLvl === 1) locationScore = 10; // Country
      } catch (err) {
        // Error handling fallback
        if (v.location?.toLowerCase() === task.location?.toLowerCase()) {
          locationScore = 20;
        }
      }

      if (locationScore > 0) {
        // Boost if urgent
        if (isUrgent) locationScore += 10;
        score += locationScore;
        reasons.push(isUrgent && locationScore >= 30 ? "Critical: High proximity matching" : `Location Match Level`);
      }
      
      return { ...v, matchScore: score, matchReasons: reasons };
    });
    
    // Sort by score descending
    scoredVolunteers.sort((a, b) => b.matchScore - a.matchScore);
    
    // Return top 5 Recommended Volunteers
    return NextResponse.json(scoredVolunteers.slice(0, 5));
  } catch(err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
