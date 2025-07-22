'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Sparkles,
    Plus,
    Calendar,
    Brain,
    MapPin,
    FileText,
    Users,
    GitBranch,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { WhiteboardTemplate } from '@/lib/ai-service';
import AIPromptModal from '@/components/ai/AIPromptModal';

const templateOptions = [
    {
        id: 'blank',
        title: 'Blank Canvas',
        description: 'Start with a clean slate',
        icon: <Plus className="h-8 w-8" />,
        color: 'from-gray-500 to-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
    },
    {
        id: 'calendar',
        title: 'Calendar',
        description: 'Perfect for scheduling and planning',
        icon: <Calendar className="h-8 w-8" />,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
    },
    {
        id: 'mindmap',
        title: 'Mind Map',
        description: 'Organize ideas and concepts',
        icon: <Brain className="h-8 w-8" />,
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
    },
    {
        id: 'timeline',
        title: 'Timeline',
        description: 'Track projects and milestones',
        icon: <MapPin className="h-8 w-8" />,
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
    },
    {
        id: 'notes',
        title: 'Study Notes',
        description: 'Organized note-taking template',
        icon: <FileText className="h-8 w-8" />,
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
    },
    {
        id: 'kanban',
        title: 'Task Board',
        description: 'Manage workflows and tasks',
        icon: <Users className="h-8 w-8" />,
        color: 'from-indigo-500 to-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200'
    },
    {
        id: 'flowchart',
        title: 'Flowchart',
        description: 'Process and decision mapping',
        icon: <GitBranch className="h-8 w-8" />,
        color: 'from-cyan-500 to-cyan-600',
        bgColor: 'bg-cyan-50',
        borderColor: 'border-cyan-200'
    },
    {
        id: 'ai',
        title: 'AI Generated',
        description: 'Let AI create the perfect layout',
        icon: <Sparkles className="h-8 w-8" />,
        color: 'from-pink-500 to-pink-600',
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-200'
    }
];

const NewWhiteboardPage = () => {
    const router = useRouter();
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('blank');

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId);
        setAiResponse(null);
    };

    const handleAIGenerate = async () => {
        if (!aiPrompt) return;
        setAiLoading(true);
        setAiResponse(null);
        try {
            const res = await fetch('/api/ai/whiteboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: aiPrompt }),
            });
            const data = await res.json();
            if (data.result) {
                setAiResponse(data.result);
            } else setAiResponse(data.error || 'No response from AI.');
        } catch (err) {
            setAiResponse('Error contacting AI.');
        } finally {
            setAiLoading(false);
        }
    };

    const handleCreate = async () => {
        setIsCreating(true);
        try {
            let templateData = null;
            if (selectedTemplate === 'ai' && aiResponse) {
                try {
                    templateData = JSON.parse(aiResponse);
                } catch { }
            }
            const response = await fetch('/api/whiteboards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `New ${templateOptions.find(t => t.id === selectedTemplate)?.title || 'Whiteboard'}`,
                    description: templateOptions.find(t => t.id === selectedTemplate)?.description,
                    template: selectedTemplate,
                    content: templateData,
                    userId: 'user1', // Replace with actual user ID
                }),
            });
            if (!response.ok) throw new Error('Failed to create whiteboard');
            const whiteboard = await response.json();
            router.push(`/whiteboard/${whiteboard.id}`);
        } catch (error) {
            alert('Failed to create whiteboard. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-12">
            {/* Faint whiteboard contour background */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center">
                <svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" className="opacity-25 scale-110">
                    {/* Main whiteboard contour with drop shadow */}
                    <filter id="shadow" x="0" y="0" width="200%" height="200%">
                        <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#b6c6e3" flood-opacity="0.18" />
                    </filter>
                    <rect x="120" y="120" width="1360" height="760" rx="60" fill="#f8fafc" stroke="#b6c6e3" strokeWidth="10" filter="url(#shadow)" />
                    {/* More visible grid lines */}
                    {Array.from({ length: 18 }).map((_, i) => (
                        <line key={i} x1={180 + i * ((1240) / 17)} y1={180} x2={180 + i * ((1240) / 17)} y2={820} stroke="#c7d2fe" strokeWidth="2" />
                    ))}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <line key={i} x1={180} y1={180 + i * ((640) / 11)} x2={1420} y2={180 + i * ((640) / 11)} stroke="#c7d2fe" strokeWidth="2" />
                    ))}
                    {/* Faint sticky note and shape previews */}
                    <rect x="320" y="260" width="220" height="110" rx="18" fill="#e0e7ff" opacity="0.32" />
                    <rect x="600" y="400" width="180" height="80" rx="14" fill="#fef3c7" opacity="0.22" />
                    <rect x="1200" y="320" width="260" height="110" rx="22" fill="#fce7f3" opacity="0.18" />
                    <circle cx="520" cy="700" r="60" fill="#fef3c7" opacity="0.18" />
                    <rect x="1000" y="700" width="200" height="80" rx="18" fill="#e0e7ff" opacity="0.18" />
                </svg>
            </div>
            <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-2xl p-8 flex flex-col items-center z-10 relative">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Whiteboard Setup</h1>
                <p className="text-gray-600 mb-8 text-center">Describe your whiteboard or pick a template to get started instantly.</p>
                {/* AI Agent Prompt */}
                <div className="w-full flex flex-col items-center mb-8">
                    <div className="w-full flex flex-col items-center gap-2">
                        <div className="relative w-full">
                            <textarea
                                value={aiPrompt}
                                onChange={e => setAiPrompt(e.target.value)}
                                placeholder="Describe your whiteboard (e.g. project roadmap with 3 phases)"
                                className="w-full border border-blue-200 rounded-xl px-4 py-5 text-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none resize-none pr-24 min-h-[72px] transition-all duration-150 bg-white/80 placeholder-gray-400 placeholder:text-sm"
                                disabled={aiLoading}
                                rows={3}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setSelectedTemplate('ai'); handleAIGenerate(); } }}
                            />
                            <button
                                className="absolute bottom-3 right-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-400 transition-all duration-150 flex items-center justify-center"
                                style={{ minWidth: 44 }}
                                onClick={() => { setSelectedTemplate('ai'); handleAIGenerate(); }}
                                disabled={aiLoading || !aiPrompt}
                                tabIndex={0}
                            >
                                {aiLoading ? (
                                    <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                                ) : (
                                    <svg className="h-5 w-5 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                    {aiResponse && (
                        <div className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-800 whitespace-pre-line mt-3">
                            <span className="font-semibold text-blue-700">AI Suggestion:</span> {aiResponse}
                        </div>
                    )}
                </div>
                {/* Templates */}
                <div className="w-full mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Or pick a template:</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {templateOptions.filter(t => t.id !== 'ai').map((template) => (
                            <button
                                key={template.id}
                                onClick={() => handleTemplateSelect(template.id)}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-150 shadow-sm ${selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                            >
                                <span className={`rounded-lg p-2 ${template.bgColor}`}>{template.icon}</span>
                                <span className="flex flex-col items-start">
                                    <span className="font-semibold text-gray-900 text-left">{template.title}</span>
                                    <span className="text-gray-500 text-sm text-left whitespace-normal">{template.description}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                {/* Create Button */}
                <button
                    className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border border-blue-400/30 mt-2"
                    onClick={handleCreate}
                    disabled={isCreating}
                >
                    {isCreating ? 'Creating...' : 'Create Whiteboard'}
                </button>
            </div>
        </div>
    );
};

export default NewWhiteboardPage; 