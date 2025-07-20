import { NextRequest, NextResponse } from 'next/server';
import { AIWhiteboardService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Generate whiteboard template using AI
        const template = await AIWhiteboardService.generateWhiteboard(prompt);

        return NextResponse.json({
            success: true,
            template,
        });
    } catch (error) {
        console.error('Error generating whiteboard:', error);
        return NextResponse.json(
            { error: 'Failed to generate whiteboard' },
            { status: 500 }
        );
    }
} 