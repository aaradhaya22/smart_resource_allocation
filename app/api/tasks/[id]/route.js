import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const tasks = await db.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    
    if (body.status) {
      tasks[index].status = body.status;
      if (body.status === 'Completed') {
        const volunteers = await db.getVolunteers();
        let volsUpdated = false;
        for (let vol of volunteers) {
          if (vol.assignedTaskId === id) {
            vol.isAvailable = true;
            volsUpdated = true;
          }
        }
        if (volsUpdated) await db.saveVolunteers(volunteers);
      }
    }
    
    await db.saveTasks(tasks);
    return NextResponse.json(tasks[index]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const tasks = await db.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    
    tasks.splice(index, 1);
    await db.saveTasks(tasks);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
