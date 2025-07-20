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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-100/60 to-blue-200/40 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Shiny blue gradient orbs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-300/40 via-blue-400/30 to-cyan-300/25 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/50 via-blue-300/35 to-indigo-300/25 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-300/30 via-blue-400/25 to-blue-500/20 rounded-full blur-3xl"></div>

        {/* Shiny noise texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }}></div>

        {/* Shiny floating elements */}
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-gradient-to-r from-indigo-400 to-blue-600 rounded-full shadow-sm"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-blue-300/50 shadow-lg z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                BrainSpace
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">Pricing</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl border border-blue-400/30"
              >
                Get Started
              </Link>
            </div>
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
              <span className="bg-gradient-to-r from-blue-500 via-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Think. <span className="font-black">CREATE.</span> Collaborate.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Create stunning whiteboards with AI assistance. Collaborate in real-time,
              organize thoughts, and bring your ideas to life instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-xl hover:shadow-2xl transform hover:scale-105 border border-blue-400/30"
            >
              Start Creating Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="flex items-center px-8 py-4 border-2 border-blue-400 text-blue-700 rounded-lg text-lg font-semibold hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-500 transition-all duration-200 shadow-lg">
              <Zap className="mr-2 h-5 w-5" />
              Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 text-gray-500 text-sm">
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${i === 1 ? 'bg-gradient-to-br from-blue-400 to-blue-500' :
                    i === 2 ? 'bg-gradient-to-br from-blue-500 to-indigo-500' :
                      i === 3 ? 'bg-gradient-to-br from-indigo-500 to-blue-600' : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                    }`}></div>
                ))}
              </div>
              <span className="font-medium">10,000+ users</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="font-medium">4.9/5 rating</span>
            </div>
          </div>
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
              Everything you need to create and collaborate
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed for teams and individuals who want to visualize their ideas quickly and effectively.
            </p>
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
      <section className="py-20 bg-gradient-to-r from-blue-500 via-blue-600 via-indigo-600 to-cyan-600 text-white relative overflow-hidden">
        {/* Shiny CTA background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-white/20 to-cyan-200/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-cyan-200/20 to-white/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-white/10 to-blue-200/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-white/8 rounded-full blur-2xl"></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>

        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your ideas?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of creators using BrainSpace to bring their ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-sm">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative">
        {/* Footer background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-semibold">BrainSpace</span>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                Where imagination comes to life
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 BrainSpace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
