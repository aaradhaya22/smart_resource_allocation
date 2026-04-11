import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculatePriority, generateId } from '@/lib/utils';

export async function GET() {
  try {
    const tasks = await db.getTasks();
    
    // Ensure all tasks have a priority (backward compatibility)
    const processedTasks = tasks.map(task => ({
      ...task,
      priority: task.priority !== undefined && task.priority !== null 
        ? task.priority 
        : calculatePriority(task.category, Number(task.affectedCount || 0))
    }));

    // Sort tasks by priority descending
    processedTasks.sort((a, b) => b.priority - a.priority);
    return NextResponse.json(processedTasks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const tasks = await db.getTasks();
    
    const newTask = {
      id: "t_" + generateId(),
      title: data.title,
      description: data.description,
      location: data.location,
      category: data.category,
      urgency: data.urgency,
      affectedCount: Number(data.affectedCount || 0),
      priority: calculatePriority(data.category, Number(data.affectedCount || 0)),
      status: data.status || "Pending",
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    await db.saveTasks(tasks);
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
