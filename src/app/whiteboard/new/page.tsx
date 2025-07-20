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
    const [showAIModal, setShowAIModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleTemplateSelect = async (templateId: string) => {
        if (templateId === 'ai') {
            setShowAIModal(true);
            return;
        }

        setIsCreating(true);

        try {
            // Create new whiteboard with selected template
            const response = await fetch('/api/whiteboards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: `New ${templateOptions.find(t => t.id === templateId)?.title}`,
                    description: templateOptions.find(t => t.id === templateId)?.description,
                    template: templateId,
                    userId: 'user1', // Replace with actual user ID
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create whiteboard');
            }

            const whiteboard = await response.json();
            router.push(`/whiteboard/${whiteboard.id}`);
        } catch (error) {
            console.error('Error creating whiteboard:', error);
            alert('Failed to create whiteboard. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleAIGenerate = async (template: WhiteboardTemplate) => {
        setIsCreating(true);

        try {
            // Create new whiteboard with AI template
            const response = await fetch('/api/whiteboards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: template.title,
                    description: template.description,
                    template: template.type,
                    content: template,
                    userId: 'user1', // Replace with actual user ID
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create whiteboard');
            }

            const whiteboard = await response.json();
            router.push(`/whiteboard/${whiteboard.id}`);
        } catch (error) {
            console.error('Error creating whiteboard:', error);
            alert('Failed to create whiteboard. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md border-b border-blue-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Create New Whiteboard</h1>
                                <p className="text-sm text-gray-600">Choose a template or start from scratch</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Start Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {templateOptions.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => handleTemplateSelect(template.id)}
                                disabled={isCreating}
                                className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 ${template.bgColor
                                    } ${template.borderColor} hover:border-opacity-60`}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                                    {template.icon}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{template.title}</h3>
                                <p className="text-sm text-gray-600">{template.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* AI Section */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Setup</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Describe what you want to create and let our AI generate the perfect whiteboard layout for you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-blue-600">1</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Describe</h3>
                            <p className="text-sm text-gray-600">Tell us what you want to create</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-indigo-600">2</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Generate</h3>
                            <p className="text-sm text-gray-600">AI creates the perfect layout</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-cyan-600">3</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Customize</h3>
                            <p className="text-sm text-gray-600">Edit and refine as needed</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => setShowAIModal(true)}
                            disabled={isCreating}
                            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-200 flex items-center justify-center mx-auto space-x-2 disabled:opacity-50"
                        >
                            {isCreating ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Sparkles className="h-5 w-5" />
                            )}
                            <span>Start with AI</span>
                        </button>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                        Tips for getting started
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <ul className="space-y-2">
                            <li>• Use templates for common use cases</li>
                            <li>• AI can understand natural language descriptions</li>
                            <li>• You can always modify layouts after creation</li>
                        </ul>
                        <ul className="space-y-2">
                            <li>• Collaborate with team members in real-time</li>
                            <li>• Export your whiteboards as images</li>
                            <li>• Save your work automatically</li>
                        </ul>
                    </div>
                </div>
            </main>

            {/* AI Modal */}
            <AIPromptModal
                isOpen={showAIModal}
                onClose={() => setShowAIModal(false)}
                onGenerate={handleAIGenerate}
            />

            {/* Loading Overlay */}
            {isCreating && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating your whiteboard...</h3>
                        <p className="text-gray-600">Please wait while we set everything up for you.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewWhiteboardPage; 