'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  Lock,
  User,
  CheckCircle
} from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign Up</h1>
        <p className="text-gray-700 mb-6">
          To create an account, please use <span className="font-semibold text-blue-600">Sign in with Google</span> on the <Link href="/auth/signin" className="text-blue-600 underline">sign-in page</Link>.
        </p>
        <Link href="/auth/signin" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Go to Sign In</Link>
      </div>
    </div>
  );
} 