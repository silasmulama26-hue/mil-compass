/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, Menu, X, Award, CheckCircle, HelpCircle } from 'lucide-react';
import { UserProgress } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  progress: UserProgress;
}

export default function Navbar({ activeTab, setActiveTab, progress }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analyze', label: 'Analyze' },
    { id: 'learn', label: 'Learn' },
    { id: 'history', label: 'History' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-xs backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2 cursor-pointer group"
              id="nav-logo"
            >
              <div className="p-2 bg-blue-50 text-primary rounded-xl group-hover:bg-blue-100 transition-colors duration-200">
                <Compass className="h-6 w-6 text-[#0057A8] animate-spin-slow" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-800">
                MIL <span className="text-[#0057A8]">Compass</span>
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-10 space-x-1 sm:space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    activeTab === item.id || (item.id === 'analyze' && activeTab === 'report')
                      ? 'text-[#0057A8] bg-blue-50/50 font-semibold'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Profile & XP Tracker on Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
              <span className="text-amber-500 font-bold text-sm">✨ {progress.xp} XP</span>
            </div>
            
            <div className="h-6 w-[1px] bg-slate-200"></div>

            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 text-left cursor-pointer group hover:opacity-90 transition-opacity"
              id="nav-profile-btn"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                  alt="Kevin's Avatar"
                  className="h-9 w-9 rounded-full object-cover border-2 border-primary"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-800 leading-none group-hover:text-primary transition-colors">Kevin</p>
                <p className="text-slate-400 font-mono mt-0.5">{progress.level}</p>
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-hidden"
              aria-label="Toggle Menu"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-item-mobile-${item.id}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                activeTab === item.id || (item.id === 'analyze' && activeTab === 'report')
                  ? 'text-[#0057A8] bg-blue-50 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                alt="Kevin"
                className="h-10 w-10 rounded-full object-cover border-2 border-primary"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="font-semibold text-slate-800 text-sm">Kevin</p>
                <p className="text-xs text-slate-400 font-mono">{progress.level}</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-full px-3 py-1 text-amber-500 font-bold text-sm">
              ✨ {progress.xp} XP
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
