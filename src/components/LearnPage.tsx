/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, Sparkles, HelpCircle, Trophy, Compass, ArrowRight } from 'lucide-react';
import { Challenge, UserProgress } from '../types';

interface LearnPageProps {
  progress: UserProgress;
  onAnswerChallenge: (xpAward: number) => void;
}

export default function LearnPage({ progress, onAnswerChallenge }: LearnPageProps) {
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [xpEarnedToday, setXpEarnedToday] = useState(30); // Kevin starts with some XP

  const challenges: Challenge[] = [
    {
      id: 'challenge-1',
      question: "Today's Challenge: Which headline is more trustworthy?",
      optionA: {
        title: "WHO approves a new malaria vaccine.",
        description: "Reputable international body citing clinical trial approvals and public health datasets.",
        isTrustworthy: true
      },
      optionB: {
        title: "Doctors hate this miracle herb...",
        description: "Sensationalist headline utilizing curiosity gaps and targeting professional medical systems.",
        isTrustworthy: false
      },
      explanation: "Card A is trustworthy because it refers to a verified global authority (WHO) backed by transparent peer-reviewed datasets. Card B is a classic example of commercial clickbait; it uses emotional manipulation ('Doctors hate this!'), naturalness bias, and offers no scientific references.",
      xpReward: 15
    },
    {
      id: 'challenge-2',
      question: "Visual Media Literacy: Which post shows stronger empirical evidence?",
      optionA: {
        title: "Blurry video caption: 'They don't want us to know what this bright light is! UFO near military zone!'",
        description: "Relies on personal amazement, suspicion, and uncontextualized short recordings.",
        isTrustworthy: false
      },
      optionB: {
        title: "National Weather Office releases altitude radar telemetry tracking a weather balloon.",
        description: "Cites direct empirical telemetry datasets and traceable geological coordinates.",
        isTrustworthy: true
      },
      explanation: "Option B provides verifiable empirical evidence—scientific telemetry logs that can be independent audited. Option A is sensationalist anecdotal testimony, designed to trigger conspiracy narratives.",
      xpReward: 15
    }
  ];

  const currentChallenge = challenges[currentChallengeIndex];

  const handleSelect = (option: 'A' | 'B') => {
    if (selectedOption) return; // already answered
    setSelectedOption(option);
    
    const isCorrect = option === 'A' ? currentChallenge.optionA.isTrustworthy : currentChallenge.optionB.isTrustworthy;
    if (isCorrect) {
      setXpEarnedToday((prev) => prev + currentChallenge.xpReward);
      onAnswerChallenge(currentChallenge.xpReward);
    }
  };

  const handleNextChallenge = () => {
    setSelectedOption(null);
    setCurrentChallengeIndex((prev) => (prev < challenges.length - 1 ? prev + 1 : 0));
  };

  const badges = [
    { id: 'thinker', name: 'Critical Thinker', desc: 'Analyzed 5 sensationalized claims', unlocked: true, icon: '🧠' },
    { id: 'finder', name: 'Fact Finder', desc: 'Verified 10 primary sources', unlocked: true, icon: '🔍' },
    { id: 'explorer', name: 'Truth Explorer', desc: 'Maintained a 5-day learning streak', unlocked: true, icon: '🧭' },
    { id: 'detective', name: 'Media Detective', desc: 'Identified clickbait algorithms', unlocked: false, icon: '🕵️' },
  ];

  const isSelectionCorrect = () => {
    if (!selectedOption) return null;
    return selectedOption === 'A' ? currentChallenge.optionA.isTrustworthy : currentChallenge.optionB.isTrustworthy;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="learn-view">
      
      {/* Header banner */}
      <div className="bg-[#0057A8] text-white rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-700 rounded-full blur-2xl opacity-45"></div>
        <div className="relative">
          <span className="bg-blue-800 border border-blue-600 text-xs px-3 py-1 rounded-full font-mono font-bold">MIL CURRICULUM</span>
          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight mt-3">Media Literacy Learning Tree</h1>
          <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-xl">
            Gamified exercises designed around UNESCO learning targets. Gain cognitive independence, unlock badges, and score points!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column (Col-span 2): Challenge workspace */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Today's Challenge */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            
            {/* Title */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Compass className="h-5 w-5 text-[#2E7D32]" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Today's Literacy Quest</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-full text-slate-500">
                Quest {currentChallengeIndex + 1} of {challenges.length}
              </span>
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-800 mb-6">{currentChallenge.question}</p>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Card A */}
              <button
                onClick={() => handleSelect('A')}
                disabled={selectedOption !== null}
                className={`text-left p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedOption === 'A'
                    ? currentChallenge.optionA.isTrustworthy
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-rose-500 bg-rose-50/50'
                    : selectedOption !== null
                    ? 'border-slate-100 opacity-60'
                    : 'border-slate-100 hover:border-[#0057A8] bg-slate-50/50 hover:bg-white hover:shadow-xs'
                }`}
                id="challenge-option-a"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0057A8] bg-blue-50 px-2.5 py-0.5 rounded-md">
                    Card A
                  </span>
                  {selectedOption === 'A' && (
                    currentChallenge.optionA.isTrustworthy ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                    )
                  )}
                </div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">{currentChallenge.optionA.title}</h4>
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">{currentChallenge.optionA.description}</p>
              </button>

              {/* Card B */}
              <button
                onClick={() => handleSelect('B')}
                disabled={selectedOption !== null}
                className={`text-left p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedOption === 'B'
                    ? currentChallenge.optionB.isTrustworthy
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-rose-500 bg-rose-50/50'
                    : selectedOption !== null
                    ? 'border-slate-100 opacity-60'
                    : 'border-slate-100 hover:border-[#0057A8] bg-slate-50/50 hover:bg-white hover:shadow-xs'
                }`}
                id="challenge-option-b"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0057A8] bg-blue-50 px-2.5 py-0.5 rounded-md">
                    Card B
                  </span>
                  {selectedOption === 'B' && (
                    currentChallenge.optionB.isTrustworthy ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                    )
                  )}
                </div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">{currentChallenge.optionB.title}</h4>
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">{currentChallenge.optionB.description}</p>
              </button>

            </div>

            {/* Explanation & Next Buttons */}
            {selectedOption !== null && (
              <div className="mt-6 border-t border-slate-100 pt-6 space-y-4 animate-fade-in">
                
                {/* Result Tag */}
                <div className={`p-4 rounded-xl flex items-start gap-3 ${
                  isSelectionCorrect()
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                    : 'bg-rose-50 text-rose-800 border border-rose-100'
                }`}>
                  {isSelectionCorrect() ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Excellent Choice! +15 XP Awarded</p>
                        <p className="text-xs mt-0.5 opacity-90">{currentChallenge.explanation}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Insightful attempt, but incorrect</p>
                        <p className="text-xs mt-0.5 opacity-90">{currentChallenge.explanation}</p>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={handleNextChallenge}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-5 rounded-xl text-xs flex items-center gap-1.5 ml-auto transition-colors cursor-pointer"
                  id="challenge-next-btn"
                >
                  Next Quest
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

          </div>

          {/* Interactive Core MIL Competency Progress Tree */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Core Competency Tracks</h3>
            <div className="space-y-4">
              {[
                { track: 'Evaluating Sourcing Indicators', level: 'Completed (100%)', bg: 'bg-emerald-500' },
                { track: 'Deconstructing Algorithmic Outrage Feeds', level: 'Level 3 (75%)', bg: 'bg-[#0057A8]' },
                { track: 'Identifying Synthetic Media & GenAI Signatures', level: 'Locked (Need Rank 5)', bg: 'bg-slate-300' }
              ].map((comp, index) => (
                <div key={index} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{comp.track}</h4>
                    <span className="text-xs font-semibold text-slate-400 mt-1 block">{comp.level}</span>
                  </div>
                  <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden shrink-0">
                    <div className={`${comp.bg} h-full`} style={{ width: comp.level.includes('100') ? '100%' : comp.level.includes('75') ? '75%' : '0%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: Progress Stats & Badges */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Today's XP Tracker */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#F9A825]" />
              Today's Performance
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mb-1">
                  <span>Today's XP Target</span>
                  <span className="font-mono text-slate-800">{xpEarnedToday} / 100 XP</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#F9A825] h-full" style={{ width: `${Math.min(xpEarnedToday, 100)}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-800">{progress.streak}</p>
                  <p className="text-[10px] uppercase text-slate-400 font-bold mt-0.5">Streak days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-[#0057A8]">{xpEarnedToday} XP</p>
                  <p className="text-[10px] uppercase text-slate-400 font-bold mt-0.5">Earned Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Curriculum Badges</h3>
            <div className="grid grid-cols-1 gap-3.5">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border flex items-center gap-3.5 transition-all ${
                    badge.unlocked
                      ? 'bg-slate-50 border-slate-100'
                      : 'bg-white border-dashed border-slate-200 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{badge.name}</h4>
                    <p className="text-xs text-slate-500 leading-tight mt-0.5">{badge.desc}</p>
                  </div>
                  {badge.unlocked && (
                    <span className="ml-auto text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                      Earned
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
