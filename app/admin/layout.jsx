// app/admin/layout.jsx
'use client';

import Link from 'next/link';
import { LogOut, Home } from 'lucide-react';

export default function AdminLayout({ children }) {
  const handleLogout = () => {
    if (confirm('Are you sure you want to go back to home?')) {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navbar */}
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/admin/experiences" className="flex items-center gap-2 text-xl font-bold">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-black font-bold">
              ⚙️
            </div>
            <span className="hidden md:inline">BookIt Admin</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin/experiences"
              className="hover:bg-gray-800 px-4 py-2 rounded transition-colors"
            >
              📦 Experiences
            </Link>
            <Link
              href="/admin/promo-codes"
              className="hover:bg-gray-800 px-4 py-2 rounded transition-colors"
            >
              🎟️ Promo Codes
            </Link>
            <div className="h-6 w-px bg-gray-700"></div>
            <Link
              href="/"
              className="flex items-center gap-2 hover:bg-gray-800 px-4 py-2 rounded transition-colors"
              title="Go to user app"
            >
              <Home className="w-5 h-5" />
              <span className="hidden md:inline">User App</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-red-600 px-4 py-2 rounded transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Exit</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-[calc(100vh-64px)]">
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm text-center py-4 mt-8">
        <p>&copy; 2025 BookIt Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
}