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
import { FaXTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa6';

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
                <a href="https://x.com/krish07sahni" target="_blank" rel="noopener noreferrer" aria-label="Krish's X">
                  <FaXTwitter className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/krish-sahni-645876291/" target="_blank" rel="noopener noreferrer" aria-label="Krish's LinkedIn">
                  <FaLinkedin className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/krishsah.ni/" target="_blank" rel="noopener noreferrer" aria-label="Krish's Instagram">
                  <FaInstagram className="w-6 h-6" />
                </a>
              </div>
            </div>
            {/* Lucas Wong */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-medium">Lucas Wong</span>
              <div className="flex gap-3 mt-1">
                <a href="https://x.com/lucas23wong" target="_blank" rel="noopener noreferrer" aria-label="Lucas's X">
                  <FaXTwitter className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/lucas-wong-817090330/" target="_blank" rel="noopener noreferrer" aria-label="Lucas's LinkedIn">
                  <FaLinkedin className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/lucasjw23/?next=%2F" target="_blank" rel="noopener noreferrer" aria-label="Lucas's Instagram">
                  <FaInstagram className="w-6 h-6" />
                </a>
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
