'use client';

import React from 'react';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  Zap,
  Users,
  Palette
} from 'lucide-react';
import WhiteboardGalleryMarquee from '@/components/WhiteboardGalleryMarquee';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-100/60 to-blue-200/40 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Smooth blue-to-white gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/60 via-white/80 to-blue-50/40"></div>
        {/* Shiny blue gradient orbs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-300/40 via-blue-400/30 to-cyan-300/25 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/50 via-blue-300/35 to-indigo-300/25 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-300/30 via-blue-400/25 to-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-blue-300/50 shadow-lg z-50">
        <div className="relative w-full h-16">
          <div className="absolute left-0 top-0 h-16 flex items-center space-x-3 pl-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              BrainSpace
            </span>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-6">
            <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">Features</a>
            <a href="#demo" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">Demo</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        {/* Shiny hero background elements */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-300/40 via-cyan-300/30 to-blue-400/25 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-cyan-200/35 via-blue-300/25 to-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-br from-indigo-300/30 via-blue-400/20 to-blue-500/15 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium mb-6 shadow-lg border border-blue-300/50">
              <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
              AI-Powered Whiteboard Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="">
                <span className="text-black">Think.</span> <span className="bg-gradient-to-r from-blue-500 via-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">Visualize.</span> <span className="text-black">Collaborate</span>.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Brain dump, organize ideas, take notes, and collaborate with ease using AI-driven whiteboards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-xl hover:shadow-2xl transform hover:scale-105 border border-blue-400/30"
            >
              Start Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="flex items-center px-8 py-4 border-2 border-blue-400 text-blue-700 rounded-lg text-lg font-semibold hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-500 transition-all duration-200 shadow-lg">
              <Zap className="mr-2 h-5 w-5" />
              Watch Demo
            </button>
          </div>

          {/* Whiteboard Gallery Marquee */}
          <WhiteboardGalleryMarquee />

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        {/* Shiny features background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/60 via-white/90 to-cyan-100/30"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-white/50"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-transparent to-blue-200/30"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to start
              <span className="inline-block ml-4 transition-all duration-300 border-2 border-blue-400 bg-gradient-to-r from-blue-50 via-blue-100 to-indigo-100 px-3 py-1 rounded-xl shadow-sm hover:shadow-blue-400/50 hover:scale-105 hover:border-blue-600 group cursor-pointer">
                <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">BrainSpacing</span>
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-300/50 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-blue-400/70 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-200 via-cyan-200 to-blue-300 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI-Powered Setup
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Describe your whiteboard and watch AI create the perfect layout with smart templates and suggestions.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-300/50 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-blue-400/70 group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-200 via-blue-300 to-indigo-300 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Real-time Collaboration
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Work together seamlessly with live updates, comments, and shared editing capabilities.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-300/50 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-blue-400/70 group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-200 via-blue-400 to-cyan-400 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Palette className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Advanced Tools
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Drawing tools, sticky notes, shapes, and more. Everything you need to bring your ideas to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        {/* Shiny how it works background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-100/50 to-white"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-200/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How BrainSpace Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in minutes, not hours. Our simple process makes creating beautiful whiteboards effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Describe Your Vision</h3>
              <p className="text-gray-600">
                Tell AI what you want to create - from project timelines to mind maps
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Creates Setup</h3>
              <p className="text-gray-600">
                Watch as AI generates the perfect layout and structure for your needs
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborate & Create</h3>
              <p className="text-gray-600">
                Invite team members and start creating together in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shiny CTA Section */}
      {/* REMOVE THIS SECTION: The duplicate CTA with 'Ready to transform your ideas?', 'Join thousands...', and 'Start Free Trial' button */}

      {/* Bottom CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-500 via-blue-600 via-indigo-600 to-cyan-600 text-white text-center mt-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your ideas?</h2>
        <div className="flex justify-center gap-6">
          <Link
            href="/dashboard"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Start Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <Brain className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-semibold">BrainSpace</span>
          </div>
          {/* Social Media Row */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto justify-center md:justify-end">
            <span className="font-semibold text-lg mb-2 md:mb-0">Follow us on social media</span>
            {/* Krish Sahni */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-medium">Krish Sahni</span>
              <div className="flex gap-3 mt-1">
                <a href="https://x.com/krish07sahni" target="_blank" rel="noopener noreferrer" aria-label="Krish's X"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 2.477h3.7l-8.13 9.28 9.57 9.766h-7.52l-5.9-6.6-6.77 6.6H1.47l8.7-9.98L.24 2.477h7.7l5.13 5.74 6.46-5.74zm-1.3 16.04h2.05L7.02 4.13H4.87l11.36 14.387z" /></svg></a>
                <a href="https://www.linkedin.com/in/krish-sahni-645876291/" target="_blank" rel="noopener noreferrer" aria-label="Krish's LinkedIn"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76c.97 0 1.75.79 1.75 1.76s-.78 1.76-1.75 1.76zm15.25 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" /></svg></a>
                <a href="https://www.instagram.com/krishsah.ni/" target="_blank" rel="noopener noreferrer" aria-label="Krish's Instagram"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.425 3.678 1.406c-.98.98-1.274 2.092-1.333 3.374C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.282.353 2.394 1.333 3.374.98.98 2.092 1.274 3.374 1.333C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.282-.059 2.394-.353 3.374-1.333.98-.98 1.274-2.092 1.333-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.282-.353-2.394-1.333-3.374-.98-.98-2.092-1.274-3.374-1.333C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" /></svg></a>
              </div>
            </div>
            {/* Lucas Wong */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-medium">Lucas Wong</span>
              <div className="flex gap-3 mt-1">
                <a href="https://x.com/lucas23wong" target="_blank" rel="noopener noreferrer" aria-label="Lucas's X"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 2.477h3.7l-8.13 9.28 9.57 9.766h-7.52l-5.9-6.6-6.77 6.6H1.47l8.7-9.98L.24 2.477h7.7l5.13 5.74 6.46-5.74zm-1.3 16.04h2.05L7.02 4.13H4.87l11.36 14.387z" /></svg></a>
                <a href="https://www.linkedin.com/in/lucas-wong-817090330/" target="_blank" rel="noopener noreferrer" aria-label="Lucas's LinkedIn"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76c.97 0 1.75.79 1.75 1.76s-.78 1.76-1.75 1.76zm15.25 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" /></svg></a>
                <a href="https://www.instagram.com/lucasjw23/?next=%2F" target="_blank" rel="noopener noreferrer" aria-label="Lucas's Instagram"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.425 3.678 1.406c-.98.98-1.274 2.092-1.333 3.374C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.282.353 2.394 1.333 3.374.98.98 2.092 1.274 3.374 1.333C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.282-.059 2.394-.353 3.374-1.333.98-.98 1.274-2.092 1.333-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.282-.353-2.394-1.333-3.374-.98-.98-2.092-1.274-3.374-1.333C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" /></svg></a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm w-full">
          <p>&copy; 2024 BrainSpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
