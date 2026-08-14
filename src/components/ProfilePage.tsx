/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Award, ShieldCheck, HelpCircle, Sparkles, RefreshCw, Star, Mail, Landmark, Trophy, Search, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProgress } from '../types';

interface ProfilePageProps {
  progress: UserProgress;
  onResetProgress: () => void;
}

export default function ProfilePage({ progress, onResetProgress }: ProfilePageProps) {
  const [celebrated, setCelebrated] = useState(false);

  // Trigger high-energy festive confetti burst
  const fireConfetti = () => {
    const count = 180;
    const defaults = { origin: { y: 0.6 } };

    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  // Trigger confetti when Media Detective badge is detected or when profile page mounts with unlocked badge
  useEffect(() => {
    const hasDetectiveBadge = progress.badges.includes("Media Detective");
    if (hasDetectiveBadge && !celebrated) {
      fireConfetti();
      setCelebrated(true);
    }
  }, [progress.badges, celebrated]);

  const allBadges = [
    { id: 'thinker', name: 'Critical Thinker', desc: 'Analyzed 5 sensationalized claims', icon: '🧠', key: 'Critical Thinker' },
    { id: 'finder', name: 'Fact Finder', desc: 'Verified 10 primary sources', icon: '🔍', key: 'Fact Finder' },
    { id: 'explorer', name: 'Truth Explorer', desc: 'Maintained a 5-day learning streak', icon: '🧭', key: 'Truth Explorer' },
    { id: 'detective', name: 'Media Detective', desc: 'Unlocked after resolving 20 quests', icon: '🕵️', key: 'Media Detective' }
  ];

  const hasDetective = progress.badges.includes("Media Detective");

  const achievements = [
    { name: 'Cognitive Sovereignty', score: `${progress.score}/100 Autonomy Rank`, desc: 'Indicates high resilience to fake reports and emotional propaganda.', unlocked: true },
    { name: 'Consensus Champion', score: `Level: ${progress.level}`, desc: 'Successfully navigated WHO and climate consensus modules.', unlocked: true },
    { name: 'First Inquiry', score: 'Challenge Complete', desc: 'Elected to perform independent web audits on political claims.', unlocked: true }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="profile-view">
      
      {/* Profile Card Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=350&auto=format&fit=crop"
            alt="Kevin"
            className="h-28 w-28 rounded-3xl object-cover border-4 border-[#0057A8] shadow-md"
            referrerPolicy="no-referrer"
          />
          <span className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-1.5 rounded-xl border-2 border-white shadow-xs">
            <Star className="h-4 w-4 fill-white text-white" />
          </span>
        </div>

        {/* Bio */}
        <div className="text-center md:text-left space-y-3 grow">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <h1 className="text-3xl font-display font-black text-slate-900">Kevin Jenkins</h1>
              <span className="text-xs font-bold bg-blue-100 text-primary px-3 py-1 rounded-full border border-blue-200">
                Rank: {progress.level}
              </span>
            </div>

            {/* Celebrate Confetti Button */}
            <button
              onClick={fireConfetti}
              className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer shrink-0 active:scale-95"
              id="celebrate-confetti-btn"
            >
              <PartyPopper className="h-4 w-4 text-amber-500 animate-bounce" />
              Celebrate Level
            </button>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-slate-400" />
              silasmulama26@gmail.com
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <Landmark className="h-4 w-4 text-slate-400" />
              UNESCO MIL Council
            </span>
          </div>

          <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
            Media literacy analyst focusing on algorithmic content amplification. Committed to deconstructing propaganda networks and reinforcing cognitive sovereignty.
          </p>
        </div>
      </div>

      {/* Media Detective Achievement Highlight Banner */}
      {hasDetective && (
        <div className="bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 mb-8 shadow-md relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/30 border border-purple-400/40 rounded-2xl text-2xl shrink-0">
                🕵️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-500/30 text-purple-200 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border border-purple-400/30">
                    SPECIAL BADGE UNLOCKED
                  </span>
                  <Sparkles className="h-4 w-4 text-amber-300 animate-spin-slow" />
                </div>
                <h3 className="text-xl font-display font-black text-white mt-1">Media Detective Badge Earned!</h3>
                <p className="text-purple-200 text-xs mt-0.5">
                  You resolved over 20 literacy quests and mastered clickbait algorithm identification.
                </p>
              </div>
            </div>

            <button
              onClick={fireConfetti}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
              id="detective-badge-confetti-btn"
            >
              <Trophy className="h-4 w-4 text-amber-300" />
              Trigger Confetti Effect
            </button>
          </div>
        </div>
      )}

      {/* Grid: Achievements and Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Stats Passport */}
        <div className="md:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Inquiry Passport</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase block">Critical Thinking Rank</span>
              <p className="text-2xl font-black text-slate-800 mt-1">{progress.score} / 100</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${progress.score}%` }}></div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase block">Daily Learning Streak</span>
              <p className="text-2xl font-black text-amber-500 mt-1">🔥 {progress.streak} Days</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase block">XP Experience Points</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">✨ {progress.xp} XP</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm("Wipe all locally compiled scorecards, streaks, and scores to reset the demonstration scenario?")) {
                onResetProgress();
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 py-3 text-xs text-slate-400 hover:text-slate-600 font-semibold border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-all cursor-pointer mt-4"
            id="reset-profile-btn"
          >
            <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" />
            Reset Demo Environment
          </button>
        </div>

        {/* Unlocked Milestones & Badges */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Badge Gallery */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Curriculum Badge Collection</h3>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {progress.badges.length} / {allBadges.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allBadges.map((badge) => {
                const isUnlocked = progress.badges.includes(badge.key);
                return (
                  <div
                    key={badge.id}
                    onClick={() => {
                      if (isUnlocked) fireConfetti();
                    }}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isUnlocked
                        ? 'bg-slate-50/80 border-slate-200/80 hover:border-blue-300 hover:shadow-xs cursor-pointer'
                        : 'bg-slate-50/30 border-dashed border-slate-200 opacity-50'
                    }`}
                  >
                    <span className="text-3xl shrink-0">{badge.icon}</span>
                    <div className="grow">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-slate-800 text-sm">{badge.name}</h4>
                        {isUnlocked && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                            Unlocked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-tight mt-1">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unlocked Milestones */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Unlocked MIL Milestones</h3>
            
            <div className="space-y-4">
              {achievements.map((item, idx) => (
                <div key={idx} className="p-5 border border-slate-100 rounded-2xl flex items-start gap-4">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">{item.name}</h4>
                    <p className="text-[#0057A8] text-xs font-bold mt-0.5">{item.score}</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* UNESCO Certification Notice */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4">
              <div className="p-2.5 bg-white text-amber-500 rounded-xl shadow-2xs shrink-0">
                <Award className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">UNESCO MIL Accreditation</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Maintain your streak for another 5 days and successfully resolve 3 political claims to unlock the <strong>UNESCO Digital Autonomy Seal</strong> on your student portfolio.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

