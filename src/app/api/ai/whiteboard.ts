import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
        }
        // Call OpenAI with the prompt
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: `You are an assistant that helps users create and edit whiteboards. If the user asks to add a shape, text, or sticky note, respond ONLY with a single JSON object describing the element. Example for a rectangle: { "type": "shape", "shape": "rectangle", "position": { "x": 200, "y": 150 }, "size": { "width": 120, "height": 80 }, "style": { "fill": "#fef3c7", "stroke": "#f59e0b", "strokeWidth": 2 } }. Example for text: { "type": "text", "content": "Hello, world!", "position": { "x": 100, "y": 100 }, "style": { "fontSize": 32, "fontFamily": "Arial", "fill": "#000000" } }. If the user asks a general question, respond with a short helpful answer.` },
                { role: 'user', content: prompt },
            ],
            max_tokens: 256,
            temperature: 0.7,
        });
        const aiResponse = completion.choices[0]?.message?.content || '';
        return NextResponse.json({ result: aiResponse });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'AI error' }, { status: 500 });
    }
} 