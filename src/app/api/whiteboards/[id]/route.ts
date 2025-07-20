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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const whiteboard = whiteboards.find(wb => wb.id === id);

        if (!whiteboard) {
            return NextResponse.json(
                { error: 'Whiteboard not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(whiteboard);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch whiteboard' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;
        const whiteboardIndex = whiteboards.findIndex(wb => wb.id === id);

        if (whiteboardIndex === -1) {
            return NextResponse.json(
                { error: 'Whiteboard not found' },
                { status: 404 }
            );
        }

        whiteboards[whiteboardIndex] = {
            ...whiteboards[whiteboardIndex],
            ...body,
            updatedAt: new Date(),
        };

        return NextResponse.json(whiteboards[whiteboardIndex]);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update whiteboard' },
            { status: 500 }
        );
    }
} 