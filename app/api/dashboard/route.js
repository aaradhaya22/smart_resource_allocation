import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tasks = await db.getTasks();
    const vols = await db.getVolunteers();
    const assigns = await db.getAssignments();
    
    const stats = {
      totalVolunteers: vols.length,
      activeTasks: tasks.filter(t => t.status !== 'Completed').length,
      tasksByUrgency: {
        High: tasks.filter(t => t.urgency === 'High' || t.urgency === 'Critical').length,
        Medium: tasks.filter(t => t.urgency === 'Medium').length,
        Low: tasks.filter(t => t.urgency === 'Low').length
      },
      criticalTasks: tasks.filter(t => t.priority >= 80).length,
      // Aggregation for charts
      taskCategories: tasks.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {})
    };
    
    return NextResponse.json(stats);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
