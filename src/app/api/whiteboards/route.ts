import { NextRequest, NextResponse } from 'next/server';

// Mock data - replace with database operations
let whiteboards = [
  {
    id: '1',
    title: 'Project Brainstorming',
    description: 'Ideas for the new product launch',
    template: 'mindmap',
    content: null,
    userId: 'user1',
    collaborators: ['user1', 'user2', 'user3'],
    isPublic: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Study Notes - Physics',
    description: 'Chapter 5: Quantum Mechanics',
    template: 'notes',
    content: null,
    userId: 'user1',
    collaborators: ['user1'],
    isPublic: false,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (userId) {
      const userWhiteboards = whiteboards.filter(wb => 
        wb.userId === userId || wb.collaborators.includes(userId)
      );
      return NextResponse.json(userWhiteboards);
    }
    
    return NextResponse.json(whiteboards);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch whiteboards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, template, userId } = body;
    
    const newWhiteboard = {
      id: Date.now().toString(),
      title,
      description,
      template,
      content: null,
      userId,
      collaborators: [userId],
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    whiteboards.push(newWhiteboard);
    
    return NextResponse.json(newWhiteboard, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create whiteboard' },
      { status: 500 }
    );
  }
} 