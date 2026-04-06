import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  try {
    const { message } = await request.json();
    const text = message.toLowerCase();
    
    if (text.includes('task') && (text.includes('first') || text.includes('highest') || text.includes('priority') || text.includes('urgent'))) {
       const tasks = await db.getTasks();
       const pending = tasks.filter(t => t.status !== 'Completed' && t.status !== 'Assigned');
       if (pending.length === 0) return NextResponse.json({ reply: "There are no pending tasks right now! Operations are fully normalized." });
       
       pending.sort((a,b) => b.priority - a.priority);
       const top = pending[0];
       return NextResponse.json({ reply: `Based on AI telemetry, you should handle **${top.title}** first. It has a Priority Score of ${top.priority} and critically affects ${top.affectedCount} people at ${top.location}.`});
    }
    
    if (text.includes('volunteer') || text.includes('best suited') || text.includes('match')) {
       return NextResponse.json({ reply: "To find the best suited volunteer for a task, click the **Smart Match ✨** button next to any task in the Task Management view. The matching algorithm scores volunteers simultaneously on skill synergy, proximity, and task urgency." });
    }

    if (text.includes('hi') || text.includes('hello')) {
      return NextResponse.json({ reply: "Hello Commander. I am Nexus AI. Ask me 'Which task should be handled first?' or 'How do I find the best volunteer?'" });
    }

    return NextResponse.json({ reply: "I am the resource telemetry AI. My current capabilities support queries like 'Which task should be handled first?' or 'How do I find the best volunteer?'" });
  } catch(error) {
    return NextResponse.json({ reply: "Cognitive sub-routine error." }, { status: 500 });
  }
}
