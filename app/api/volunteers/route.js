import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const volunteers = await db.getVolunteers();
    return NextResponse.json(volunteers);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const volunteers = await db.getVolunteers();
    
    const newVolunteer = {
      id: "v_" + generateId(),
      name: data.name,
      skill: data.skill,
      secondarySkills: data.secondarySkills || [],
      location: data.location,
      isAvailable: data.isAvailable ?? true,
      createdAt: new Date().toISOString()
    };
    
    volunteers.push(newVolunteer);
    await db.saveVolunteers(volunteers);
    
    return NextResponse.json(newVolunteer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
