import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
      if (v.location.toLowerCase() === task.location.toLowerCase() || task.location.toLowerCase().includes(v.location.toLowerCase())) {
        score += isUrgent ? 40 : 30;
        reasons.push(isUrgent ? "Critical: High proximity matching" : "Location Match");
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
