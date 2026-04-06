import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const assignments = await db.getAssignments();
    return NextResponse.json(assignments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { taskId, volunteerId } = data;
    
    const tasks = await db.getTasks();
    const volunteers = await db.getVolunteers();
    const assignments = await db.getAssignments();
    
    // Find resources
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    const volIndex = volunteers.findIndex(v => v.id === volunteerId);
    
    if (taskIndex === -1 || volIndex === -1) {
      return NextResponse.json({ error: "Task or Volunteer not found" }, { status: 404 });
    }
    
    // Update task status
    tasks[taskIndex].status = "Assigned";
    // Optionally make volunteer unavailable
    volunteers[volIndex].isAvailable = false;
    
    const newAssignment = {
      id: "a_" + generateId(),
      taskId,
      volunteerId,
      assignedAt: new Date().toISOString(),
      status: "Active"
    };
    
    assignments.push(newAssignment);
    
    await db.saveTasks(tasks);
    await db.saveVolunteers(volunteers);
    await db.saveAssignments(assignments);
    
    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
