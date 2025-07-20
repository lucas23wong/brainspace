'use client';

import React, { useState } from 'react';
import {
    X,
    Sparkles,
    Send,
    Loader2,
    Calendar,
    Brain,
    MapPin,
    FileText,
    Users,
    GitBranch,
    CheckCircle
} from 'lucide-react';
import { WhiteboardTemplate } from '@/lib/ai-service';

interface AIPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (template: WhiteboardTemplate) => void;
}

const templateExamples = [
    {
        icon: <Calendar className="h-5 w-5" />,
        title: 'Calendar',
        examples: [
            'Create a calendar for my project deadlines',
            'Set up a monthly planner',
            'Make a weekly schedule'
        ]
    },
    {
        icon: <Brain className="h-5 w-5" />,
        title: 'Mind Map',
        examples: [
            'Create a mind map for brainstorming ideas',
            'Set up a concept map for learning',
            'Make an idea organization chart'
        ]
    },
    {
        icon: <MapPin className="h-5 w-5" />,
        title: 'Timeline',
        examples: [
            'Create a project timeline',
            'Set up a historical timeline',
            'Make a roadmap for development'
        ]
    },
    {
        icon: <Users className="h-5 w-5" />,
        title: 'Kanban',
        examples: [
            'Create a task management board',
            'Set up a workflow tracker',
            'Make a project management board'
        ]
    },
    {
        icon: <FileText className="h-5 w-5" />,
        title: 'Notes',
        examples: [
            'Create study notes template',
            'Set up meeting notes',
            'Make a documentation template'
        ]
    },
    {
        icon: <GitBranch className="h-5 w-5" />,
        title: 'Flowchart',
        examples: [
            'Create a process flowchart',
            'Set up a decision tree',
            'Make a workflow diagram'
        ]
    }
];

const AIPromptModal: React.FC<AIPromptModalProps> = ({
    isOpen,
    onClose,
    onGenerate
}) => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedExample, setSelectedExample] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isGenerating) return;

        setIsGenerating(true);
        try {
            const response = await fetch('/api/ai/whiteboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt.trim() }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate whiteboard');
            }

            const data = await response.json();
            onGenerate(data.template);
            onClose();
        } catch (error) {
            console.error('Error generating whiteboard:', error);
            alert('Failed to generate whiteboard. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExampleClick = (example: string) => {
        setPrompt(example);
        setSelectedExample(example);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">AI Whiteboard Setup</h2>
                            <p className="text-sm text-gray-600">Describe what you want to create</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Prompt Input */}
                    <form onSubmit={handleSubmit} className="mb-6">
                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your whiteboard... (e.g., 'Create a calendar for my project deadlines' or 'Set up a mind map for brainstorming ideas')"
                                className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={4}
                                disabled={isGenerating}
                            />
                            <button
                                type="submit"
                                disabled={!prompt.trim() || isGenerating}
                                className="absolute bottom-3 right-3 p-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isGenerating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Template Examples */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Templates</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {templateExamples.map((template, index) => (
                                <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                            {template.icon}
                                        </div>
                                        <h4 className="font-medium text-gray-900">{template.title}</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {template.examples.map((example, exampleIndex) => (
                                            <button
                                                key={exampleIndex}
                                                onClick={() => handleExampleClick(example)}
                                                className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${selectedExample === example
                                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {example}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                            Tips for better results
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Be specific about what you want to create</li>
                            <li>• Mention the purpose (planning, brainstorming, etc.)</li>
                            <li>• Include any specific elements you need</li>
                            <li>• You can always modify the generated layout</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPromptModal; 