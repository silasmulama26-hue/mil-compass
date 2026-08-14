/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, LogIn, UserPlus, Database, Key, CheckCircle2, AlertTriangle, Copy, Check, ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';
import { supabase, isSupabaseConfigured, SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface SupabaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthSuccess: (user: User | null, message?: string) => void;
  onSignOut: () => void;
}

export default function SupabaseAuthModal({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onSignOut
}: SupabaseAuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlSetup, setShowSqlSetup] = useState(false);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMsg('Supabase client is not configured. Please check environment variables.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          onAuthSuccess(data.user, '🎉 Account created! You are now signed in via Supabase Auth.');
          onClose();
        } else {
          setErrorMsg('Sign up successful! Please check your email to confirm registration.');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          onAuthSuccess(data.user, '👋 Welcome back! Signed in with Supabase Authentication.');
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="supabase-auth-modal">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <span>Supabase Account</span>
                {isSupabaseConfigured ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Connected
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                    Offline Demo
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                Sync analysis history and authenticate with Supabase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            id="close-auth-modal-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* If Not Configured Info */}
        {!isSupabaseConfigured && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Supabase Credentials Required</span>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              To connect your live Supabase project, declare <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> and <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_ANON_KEY</code> in environment settings.
            </p>
          </div>
        )}

        {/* Logged In View */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="font-bold text-slate-800 text-sm">{currentUser.email}</span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">User ID: {currentUser.id.substring(0, 16)}...</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                Authenticated
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Your claim analyses and scorecards are linked to your Supabase account.
            </p>

            <button
              onClick={() => setShowSqlSetup(!showSqlSetup)}
              className="w-full text-left text-xs font-bold text-[#0057A8] hover:underline flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>{showSqlSetup ? 'Hide' : 'Show'} Supabase Database Table SQL Setup</span>
            </button>

            {showSqlSetup && (
              <div className="p-3 bg-slate-900 text-slate-100 rounded-2xl space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">SQL Schema Script</span>
                  <button
                    onClick={handleCopySql}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-sans font-bold text-slate-200 cursor-pointer"
                  >
                    {copiedSql ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="max-h-40 overflow-y-auto text-[10px] leading-relaxed text-emerald-300">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold rounded-xl transition-colors cursor-pointer text-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Auth Form (Login / Signup) */
          <form onSubmit={handleAuth} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Kevin Jenkins"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0057A8] focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0057A8] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0057A8] focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg(null);
                }}
                className="text-xs font-bold text-[#0057A8] hover:underline cursor-pointer"
              >
                {isSignUp ? 'Already have a Supabase user account? Sign In' : 'Need an account? Sign Up with Supabase'}
              </button>

              <button
                type="submit"
                disabled={loading || !isSupabaseConfigured}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0057A8] hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : isSignUp ? (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Create User</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowSqlSetup(!showSqlSetup)}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <Database className="h-3.5 w-3.5" />
                <span>Supabase SQL Setup Instructions</span>
              </button>
            </div>

            {showSqlSetup && (
              <div className="p-3 bg-slate-900 text-slate-100 rounded-2xl space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Table Schema SQL</span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-sans font-bold text-slate-200 cursor-pointer"
                  >
                    {copiedSql ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="max-h-36 overflow-y-auto text-[10px] leading-relaxed text-emerald-300">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            )}

          </form>
        )}

      </div>
    </div>
  );
}
