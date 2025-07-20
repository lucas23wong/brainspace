'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Grid,
  List,
  MoreVertical,
  Share,
  Edit,
  Trash2,
  Brain,
  Calendar,
  MapPin,
  FileText,
  Users,
  Clock
} from 'lucide-react';

interface Whiteboard {
  id: string;
  title: string;
  description?: string;
  template?: string;
  lastModified: Date;
  collaborators: number;
  isPublic: boolean;
}

const DashboardPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with real data from API
  const whiteboards: Whiteboard[] = [
    {
      id: '1',
      title: 'Project Brainstorming',
      description: 'Ideas for the new product launch',
      template: 'mindmap',
      lastModified: new Date('2024-01-15'),
      collaborators: 3,
      isPublic: false,
    },
    {
      id: '2',
      title: 'Study Notes - Physics',
      description: 'Chapter 5: Quantum Mechanics',
      template: 'notes',
      lastModified: new Date('2024-01-14'),
      collaborators: 1,
      isPublic: false,
    },
    {
      id: '3',
      title: 'Team Meeting Agenda',
      description: 'Weekly standup and planning',
      template: 'calendar',
      lastModified: new Date('2024-01-13'),
      collaborators: 5,
      isPublic: true,
    },
    {
      id: '4',
      title: 'Product Roadmap',
      description: 'Q1 2024 development plan',
      template: 'timeline',
      lastModified: new Date('2024-01-12'),
      collaborators: 2,
      isPublic: false,
    },
  ];

  const getTemplateIcon = (template?: string) => {
    switch (template) {
      case 'mindmap':
        return <Brain className="h-6 w-6 text-blue-600" />;
      case 'calendar':
        return <Calendar className="h-6 w-6 text-green-600" />;
      case 'notes':
        return <FileText className="h-6 w-6 text-purple-600" />;
      case 'timeline':
        return <MapPin className="h-6 w-6 text-orange-600" />;
      default:
        return <Brain className="h-6 w-6 text-gray-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const filteredWhiteboards = whiteboards.filter(wb =>
    wb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wb.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">BrainSpace</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/whiteboard/new" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Whiteboard</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Whiteboards</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search whiteboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Whiteboards Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWhiteboards.map((whiteboard) => (
              <div key={whiteboard.id} className="card hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getTemplateIcon(whiteboard.template)}
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {whiteboard.template || 'Custom'}
                      </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {whiteboard.title}
                  </h3>

                  {whiteboard.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {whiteboard.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{whiteboard.collaborators}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(whiteboard.lastModified)}</span>
                    </div>
                  </div>

                  {whiteboard.isPublic && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Public
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWhiteboards.map((whiteboard) => (
              <div key={whiteboard.id} className="card p-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getTemplateIcon(whiteboard.template)}
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {whiteboard.title}
                      </h3>
                      {whiteboard.description && (
                        <p className="text-sm text-gray-600">{whiteboard.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{whiteboard.collaborators}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(whiteboard.lastModified)}</span>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" title="Share">
                        <Share className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-red-100 rounded text-red-600" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredWhiteboards.length === 0 && (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No whiteboards found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search terms.' : 'Create your first whiteboard to get started.'}
            </p>
            {!searchQuery && (
              <button className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Whiteboard
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage; 