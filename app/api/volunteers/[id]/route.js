import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const volunteers = await db.getVolunteers();
    const index = volunteers.findIndex(v => v.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }
    
    volunteers.splice(index, 1);
    await db.saveVolunteers(volunteers);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const volunteers = await db.getVolunteers();
    const index = volunteers.findIndex(v => v.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }
    
    if (body.location !== undefined) {
      volunteers[index].location = body.location;
    }
    
    await db.saveVolunteers(volunteers);
    return NextResponse.json(volunteers[index]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
