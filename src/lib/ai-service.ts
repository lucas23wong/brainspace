import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface WhiteboardTemplate {
    type: 'calendar' | 'mindmap' | 'timeline' | 'kanban' | 'notes' | 'flowchart' | 'custom';
    title: string;
    description: string;
    elements: WhiteboardElement[];
    backgroundColor?: string;
    grid?: boolean;
}

export interface WhiteboardElement {
    id: string;
    type: 'text' | 'shape' | 'line' | 'sticky' | 'image' | 'group';
    position: { x: number; y: number };
    size?: { width: number; height: number };
    content?: string;
    style?: {
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        fontSize?: number;
        fontFamily?: string;
        backgroundColor?: string;
        borderColor?: string;
        borderRadius?: number;
    };
    children?: WhiteboardElement[];
}

export class AIWhiteboardService {
    private static async analyzePrompt(prompt: string): Promise<{
        template: string;
        elements: string[];
        title: string;
        description: string;
    }> {
        const systemPrompt = `You are an AI assistant that helps users set up whiteboards. Analyze the user's prompt and determine:
1. The most appropriate template type (calendar, mindmap, timeline, kanban, notes, flowchart, or custom)
2. What elements should be included
3. A suitable title
4. A brief description

Available templates:
- calendar: For scheduling, events, appointments
- mindmap: For brainstorming, idea organization
- timeline: For project planning, historical events
- kanban: For task management, workflow
- notes: For study notes, documentation
- flowchart: For processes, decision trees
- custom: For unique layouts

Respond with a JSON object containing: template, elements (array of element descriptions), title, description`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
        });

        try {
            const result = JSON.parse(response.choices[0].message.content || '{}');
            return {
                template: result.template || 'custom',
                elements: result.elements || [],
                title: result.title || 'New Whiteboard',
                description: result.description || 'AI-generated whiteboard',
            };
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            return {
                template: 'custom',
                elements: [],
                title: 'New Whiteboard',
                description: 'AI-generated whiteboard',
            };
        }
    }

    private static generateCalendarTemplate(elements: string[]): WhiteboardTemplate {
        const calendarElements: WhiteboardElement[] = [];

        // Add calendar grid
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        months.forEach((month, index) => {
            calendarElements.push({
                id: `month-${index}`,
                type: 'text',
                position: { x: 50 + (index % 4) * 200, y: 50 + Math.floor(index / 4) * 150 },
                size: { width: 180, height: 120 },
                content: month,
                style: {
                    fontSize: 16,
                    fontFamily: 'Arial',
                    fill: '#2563eb',
                    backgroundColor: '#f8fafc',
                    borderColor: '#e2e8f0',
                    borderRadius: 8,
                }
            });
        });

        // Add title
        calendarElements.unshift({
            id: 'title',
            type: 'text',
            position: { x: 50, y: 20 },
            content: 'Calendar 2024',
            style: {
                fontSize: 24,
                fontFamily: 'Arial',
                fill: '#1e293b',
            }
        });

        return {
            type: 'calendar',
            title: 'Calendar 2024',
            description: 'Annual calendar with monthly sections',
            elements: calendarElements,
            backgroundColor: '#ffffff',
            grid: true,
        };
    }

    private static generateMindmapTemplate(elements: string[]): WhiteboardTemplate {
        const mindmapElements: WhiteboardElement[] = [];

        // Central topic
        mindmapElements.push({
            id: 'central',
            type: 'shape',
            position: { x: 400, y: 300 },
            size: { width: 120, height: 60 },
            content: 'Main Topic',
            style: {
                fill: '#3b82f6',
                stroke: '#1d4ed8',
                strokeWidth: 2,
                fontSize: 16,
                fontFamily: 'Arial',
            }
        });

        // Add branches
        const branches = elements.length > 0 ? elements.slice(0, 6) : ['Branch 1', 'Branch 2', 'Branch 3'];
        branches.forEach((branch, index) => {
            const angle = (index * 60) * (Math.PI / 180);
            const radius = 150;
            const x = 400 + Math.cos(angle) * radius;
            const y = 300 + Math.sin(angle) * radius;

            mindmapElements.push({
                id: `branch-${index}`,
                type: 'shape',
                position: { x, y },
                size: { width: 100, height: 50 },
                content: branch,
                style: {
                    fill: '#10b981',
                    stroke: '#059669',
                    strokeWidth: 2,
                    fontSize: 14,
                    fontFamily: 'Arial',
                }
            });

            // Add connecting line
            mindmapElements.push({
                id: `line-${index}`,
                type: 'line',
                position: { x: 400, y: 300 },
                style: {
                    stroke: '#6b7280',
                    strokeWidth: 2,
                }
            });
        });

        return {
            type: 'mindmap',
            title: 'Mind Map',
            description: 'Central topic with branching ideas',
            elements: mindmapElements,
            backgroundColor: '#f8fafc',
            grid: false,
        };
    }

    private static generateTimelineTemplate(elements: string[]): WhiteboardTemplate {
        const timelineElements: WhiteboardElement[] = [];

        // Timeline line
        timelineElements.push({
            id: 'timeline-line',
            type: 'line',
            position: { x: 50, y: 300 },
            size: { width: 700, height: 4 },
            style: {
                stroke: '#6b7280',
                strokeWidth: 4,
            }
        });

        // Add timeline events
        const events = elements.length > 0 ? elements.slice(0, 5) : ['Event 1', 'Event 2', 'Event 3', 'Event 4', 'Event 5'];
        events.forEach((event, index) => {
            const x = 100 + index * 150;

            // Event marker
            timelineElements.push({
                id: `marker-${index}`,
                type: 'shape',
                position: { x, y: 280 },
                size: { width: 20, height: 20 },
                style: {
                    fill: '#ef4444',
                    stroke: '#dc2626',
                    strokeWidth: 2,
                }
            });

            // Event text
            timelineElements.push({
                id: `event-${index}`,
                type: 'text',
                position: { x: x - 50, y: 320 },
                content: event,
                style: {
                    fontSize: 14,
                    fontFamily: 'Arial',
                    fill: '#374151',
                }
            });
        });

        return {
            type: 'timeline',
            title: 'Project Timeline',
            description: 'Sequential timeline with key events',
            elements: timelineElements,
            backgroundColor: '#ffffff',
            grid: false,
        };
    }

    private static generateKanbanTemplate(elements: string[]): WhiteboardTemplate {
        const kanbanElements: WhiteboardElement[] = [];

        const columns = ['To Do', 'In Progress', 'Done'];
        columns.forEach((column, colIndex) => {
            const x = 50 + colIndex * 250;

            // Column header
            kanbanElements.push({
                id: `header-${colIndex}`,
                type: 'text',
                position: { x, y: 50 },
                content: column,
                style: {
                    fontSize: 18,
                    fontFamily: 'Arial',
                    fill: '#1f2937',
                    backgroundColor: '#f3f4f6',
                    borderRadius: 8,
                }
            });

            // Column background
            kanbanElements.push({
                id: `col-${colIndex}`,
                type: 'shape',
                position: { x, y: 80 },
                size: { width: 220, height: 400 },
                style: {
                    fill: '#f9fafb',
                    stroke: '#d1d5db',
                    strokeWidth: 1,
                    borderRadius: 8,
                }
            });

            // Add some sample cards
            const cards = ['Task 1', 'Task 2', 'Task 3'];
            cards.forEach((card, cardIndex) => {
                kanbanElements.push({
                    id: `card-${colIndex}-${cardIndex}`,
                    type: 'shape',
                    position: { x: x + 10, y: 100 + cardIndex * 80 },
                    size: { width: 200, height: 60 },
                    content: card,
                    style: {
                        fill: '#ffffff',
                        stroke: '#e5e7eb',
                        strokeWidth: 1,
                        borderRadius: 6,
                        fontSize: 14,
                        fontFamily: 'Arial',
                    }
                });
            });
        });

        return {
            type: 'kanban',
            title: 'Task Board',
            description: 'Kanban board with task columns',
            elements: kanbanElements,
            backgroundColor: '#ffffff',
            grid: false,
        };
    }

    public static async generateWhiteboard(prompt: string): Promise<WhiteboardTemplate> {
        try {
            const analysis = await this.analyzePrompt(prompt);

            switch (analysis.template) {
                case 'calendar':
                    return this.generateCalendarTemplate(analysis.elements);
                case 'mindmap':
                    return this.generateMindmapTemplate(analysis.elements);
                case 'timeline':
                    return this.generateTimelineTemplate(analysis.elements);
                case 'kanban':
                    return this.generateKanbanTemplate(analysis.elements);
                case 'notes':
                    return this.generateNotesTemplate(analysis.elements);
                case 'flowchart':
                    return this.generateFlowchartTemplate(analysis.elements);
                default:
                    return this.generateCustomTemplate(analysis.elements);
            }
        } catch (error) {
            console.error('Error generating whiteboard:', error);
            return this.generateCustomTemplate([]);
        }
    }

    private static generateNotesTemplate(elements: string[]): WhiteboardTemplate {
        const notesElements: WhiteboardElement[] = [];

        // Title
        notesElements.push({
            id: 'title',
            type: 'text',
            position: { x: 50, y: 50 },
            content: 'Study Notes',
            style: {
                fontSize: 24,
                fontFamily: 'Arial',
                fill: '#1e293b',
            }
        });

        // Add note sections
        const sections = elements.length > 0 ? elements.slice(0, 4) : ['Section 1', 'Section 2', 'Section 3', 'Section 4'];
        sections.forEach((section, index) => {
            const y = 120 + index * 120;

            notesElements.push({
                id: `section-${index}`,
                type: 'text',
                position: { x: 50, y },
                content: section,
                style: {
                    fontSize: 18,
                    fontFamily: 'Arial',
                    fill: '#3b82f6',
                }
            });

            // Add placeholder text
            notesElements.push({
                id: `content-${index}`,
                type: 'text',
                position: { x: 50, y: y + 30 },
                content: 'Add your notes here...',
                style: {
                    fontSize: 14,
                    fontFamily: 'Arial',
                    fill: '#6b7280',
                }
            });
        });

        return {
            type: 'notes',
            title: 'Study Notes',
            description: 'Organized note-taking template',
            elements: notesElements,
            backgroundColor: '#ffffff',
            grid: false,
        };
    }

    private static generateFlowchartTemplate(elements: string[]): WhiteboardTemplate {
        const flowchartElements: WhiteboardElement[] = [];

        // Start node
        flowchartElements.push({
            id: 'start',
            type: 'shape',
            position: { x: 300, y: 50 },
            size: { width: 100, height: 50 },
            content: 'Start',
            style: {
                fill: '#10b981',
                stroke: '#059669',
                strokeWidth: 2,
                fontSize: 14,
                fontFamily: 'Arial',
            }
        });

        // Process nodes
        const processes = elements.length > 0 ? elements.slice(0, 3) : ['Process 1', 'Process 2', 'Process 3'];
        processes.forEach((process, index) => {
            const y = 150 + index * 100;

            flowchartElements.push({
                id: `process-${index}`,
                type: 'shape',
                position: { x: 300, y },
                size: { width: 120, height: 60 },
                content: process,
                style: {
                    fill: '#3b82f6',
                    stroke: '#1d4ed8',
                    strokeWidth: 2,
                    fontSize: 14,
                    fontFamily: 'Arial',
                }
            });

            // Add connecting arrows
            if (index > 0) {
                flowchartElements.push({
                    id: `arrow-${index}`,
                    type: 'line',
                    position: { x: 350, y: 150 + (index - 1) * 100 },
                    style: {
                        stroke: '#6b7280',
                        strokeWidth: 2,
                    }
                });
            }
        });

        // End node
        flowchartElements.push({
            id: 'end',
            type: 'shape',
            position: { x: 300, y: 450 },
            size: { width: 100, height: 50 },
            content: 'End',
            style: {
                fill: '#ef4444',
                stroke: '#dc2626',
                strokeWidth: 2,
                fontSize: 14,
                fontFamily: 'Arial',
            }
        });

        return {
            type: 'flowchart',
            title: 'Process Flowchart',
            description: 'Step-by-step process visualization',
            elements: flowchartElements,
            backgroundColor: '#f8fafc',
            grid: false,
        };
    }

    private static generateCustomTemplate(elements: string[]): WhiteboardTemplate {
        return {
            type: 'custom',
            title: 'Custom Whiteboard',
            description: 'Blank canvas for your ideas',
            elements: [],
            backgroundColor: '#ffffff',
            grid: true,
        };
    }
} 