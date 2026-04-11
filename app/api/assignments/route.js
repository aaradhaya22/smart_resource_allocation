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
    const { taskId, volunteerId, volunteerIds } = data;
    
    // Normalize into an array to support multi-assignment
    let idsToAssign = [];
    if (volunteerIds && Array.isArray(volunteerIds)) {
      idsToAssign = volunteerIds;
    } else if (volunteerId) {
      idsToAssign = [volunteerId];
    } else {
      return NextResponse.json({ error: "No volunteers specified" }, { status: 400 });
    }
    
    const tasks = await db.getTasks();
    const volunteers = await db.getVolunteers();
    const assignments = await db.getAssignments();
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    // Update task status
    tasks[taskIndex].status = "Assigned";
    
    let createdAssignments = [];
    let updatedVolunteers = false;

    for (const vId of idsToAssign) {
      const volIndex = volunteers.findIndex(v => v.id === vId);
      if (volIndex !== -1) {
        // Optionally make volunteer unavailable
        volunteers[volIndex].isAvailable = false;
        volunteers[volIndex].assignedTaskId = taskId;
        volunteers[volIndex].assignedTask = tasks[taskIndex].title;
        updatedVolunteers = true;

        const newAssignment = {
          id: "a_" + generateId(),
          taskId,
          volunteerId: vId,
          assignedAt: new Date().toISOString(),
          status: "Active"
        };
        
        assignments.push(newAssignment);
        createdAssignments.push(newAssignment);
      }
    }
    
    await db.saveTasks(tasks);
    if (updatedVolunteers) {
      await db.saveVolunteers(volunteers);
    }
    await db.saveAssignments(assignments);
    
    return NextResponse.json(createdAssignments, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
