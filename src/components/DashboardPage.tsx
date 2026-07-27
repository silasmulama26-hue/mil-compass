/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Calendar, Flame, AlertCircle, Sparkles, PlusCircle, BookOpen, Clock, Settings, ArrowRight, TrendingUp, BarChart3, PieChart as PieChartIcon, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { UserProgress, CompassReport } from '../types';

interface DashboardPageProps {
  progress: UserProgress;
  recentAnalyses: CompassReport[];
  setActiveTab: (tab: string) => void;
  onSelectRecentAnalysis: (report: CompassReport) => void;
}

export default function DashboardPage({
  progress,
  recentAnalyses,
  setActiveTab,
  onSelectRecentAnalysis,
}: DashboardPageProps) {
  // Algorithmic Bias Simulator State
  const [sensationalismBoost, setSensationalismBoost] = useState(7); // 1-10
  const [filterStrength, setFilterStrength] = useState(80); // 0-100%
  const [commercialBias, setCommercialBias] = useState<'Low' | 'Medium' | 'High'>('High');
  const [chartView, setChartView] = useState<'bar' | 'pie'>('bar');

  // Calculate misinformation trends from user analyses using recharts
  const trendData = React.useMemo(() => {
    let highOutrage = 0;
    let highClickbait = 0;
    let lowCredibility = 0;
    let weakEvidence = 0;
    let highBias = 0;

    recentAnalyses.forEach((report) => {
      if (report.emotionalManipulation === 'High' || report.emotionalManipulation === 'Moderate') highOutrage++;
      if (report.clickbaitRisk === 'High' || report.clickbaitRisk === 'Medium') highClickbait++;
      if (report.sourceCredibility === 'Low' || report.sourceCredibility === 'Unknown') lowCredibility++;
      if (report.evidenceStrength === 'Weak') weakEvidence++;
      if (report.biasIndicator === 'High' || report.biasIndicator === 'Medium') highBias++;
    });

    return [
      { name: 'Outrage Trigger', count: highOutrage, color: '#f43f5e' },
      { name: 'Clickbait Hook', count: highClickbait, color: '#0057A8' },
      { name: 'Low Credibility', count: lowCredibility, color: '#eab308' },
      { name: 'Weak Evidence', count: weakEvidence, color: '#a855f7' },
      { name: 'Partisan Bias', count: highBias, color: '#f97316' },
    ];
  }, [recentAnalyses]);

  const credibilityPieData = React.useMemo(() => {
    let high = 0;
    let medium = 0;
    let low = 0;

    recentAnalyses.forEach((report) => {
      if (report.sourceCredibility === 'High') high++;
      else if (report.sourceCredibility === 'Medium') medium++;
      else low++;
    });

    return [
      { name: 'High Credibility', value: high, color: '#10b981' },
      { name: 'Medium Credibility', value: medium, color: '#f59e0b' },
      { name: 'Low/Unverified', value: low, color: '#f43f5e' },
    ];
  }, [recentAnalyses]);

  const topMisinfoVector = React.useMemo(() => {
    const sorted = [...trendData].sort((a, b) => b.count - a.count);
    return sorted[0] || { name: 'Outrage Trigger', count: 0 };
  }, [trendData]);

  // Headings generated based on algorithmic parameters
  const getSimulatedFeed = () => {
    if (sensationalismBoost > 7 && filterStrength > 70) {
      return [
        {
          id: 1,
          headline: "ALERT: Shocking Kepler Alien Cover-up Finally Uncovered by Insider!",
          source: "TruthSentinel.blog",
          metrics: "🔥 145K shares • 98% Outrage Index",
          impact: "Extreme Confirmation Bias",
          category: "Conspiracy",
          type: "outrage"
        },
        {
          id: 2,
          headline: "doctors hate this! The miraculous dandelion leaf that cures all diseases!",
          source: "NatureCuresInfo.net",
          metrics: "🔥 89K shares • Ad Sponsored",
          impact: "High Commercial Profit Motif",
          category: "Medical",
          type: "commercial"
        },
        {
          id: 3,
          headline: "WARNING: They are cheating! Destroyed ballots found in local voting trash!",
          source: "PatriotPatrol.news",
          metrics: "🔥 240K shares • 99% Outrage Index",
          impact: "Filter Bubble Bias",
          category: "Political",
          type: "outrage"
        }
      ];
    } else if (sensationalismBoost > 4 || filterStrength > 40) {
      return [
        {
          id: 1,
          headline: "Did NASA find signs of life on Kepler-452b? Experts weigh in.",
          source: "SpaceWonders.com",
          metrics: "💬 12K shares • Moderate Engagement",
          impact: "Curiosity Gap Trigger",
          category: "Science",
          type: "curiosity"
        },
        {
          id: 2,
          headline: "Natural herbs versus modern therapies: An ongoing debate.",
          source: "HealthMindset.com",
          metrics: "💬 4K shares • Sponsored",
          impact: "Commercial Placement Bias",
          category: "Medical",
          type: "commercial"
        },
        {
          id: 3,
          headline: "Parties dispute ballot audit timeline as election approaches.",
          source: "NationalObserver.org",
          metrics: "💬 22K shares • partisan debate",
          impact: "Balanced Bias",
          category: "Political",
          type: "neutral"
        }
      ];
    } else {
      return [
        {
          id: 1,
          headline: "NASA astronomers publish new atmospheric models of Kepler-452b.",
          source: "Astrobiology Journal",
          metrics: "✓ Peer-reviewed • Low Virality",
          impact: "Objective Research",
          category: "Science",
          type: "neutral"
        },
        {
          id: 2,
          headline: "Clinical review finds no evidence dandelion extracts cure oncology cells.",
          source: "Oncology Review Board",
          metrics: "✓ Academic Consensus • 200 shares",
          impact: "Verifiable Science",
          category: "Medical",
          type: "neutral"
        },
        {
          id: 3,
          headline: "Bipartisan Election Board publishes ballot audit guidelines for transparency.",
          source: "Local Board of Elections",
          metrics: "✓ Public Record • Official",
          impact: "Institutional Accountability",
          category: "Political",
          type: "neutral"
        }
      ];
    }
  };

  const feed = getSimulatedFeed();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="dashboard-view">
      {/* Welcome & Profile Summary Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-60"></div>
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
            alt="Kevin"
            className="h-16 w-16 rounded-2xl object-cover border-2 border-[#0057A8]"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 flex items-center gap-2">
              Welcome back, Kevin 👋
            </h1>
            <p className="text-slate-500 mt-1">
              Your critical autonomy has improved by <strong className="text-[#0057A8]">4%</strong> this week. Keep up the active inquiry!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3">
          <Sparkles className="h-5 w-5 text-[#0057A8]" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#0057A8] font-bold">Curriculum Level</p>
            <p className="font-display font-bold text-slate-800">{progress.level}</p>
          </div>
        </div>
      </div>

      {/* Beautiful Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Critical Thinking Score */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Thinking Score</span>
            <div className="p-2 bg-blue-50 text-[#0057A8] rounded-xl">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-display font-black text-slate-900">
              {progress.score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#0057A8] h-full rounded-full" style={{ width: `${progress.score}%` }}></div>
            </div>
          </div>
        </div>

        {/* Card 2: Weekly Streak */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Streak</span>
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
              <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-display font-black text-slate-900">
              {progress.streak} <span className="text-xs text-slate-400 font-normal">Days</span>
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1">
              ✓ Active today! Streak secured
            </p>
          </div>
        </div>

        {/* Card 3: Challenges Completed */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Challenges Completed</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-display font-black text-slate-900">
              {progress.challengesCompleted}
            </p>
            <p className="text-xs text-slate-400 mt-3 font-medium">
              +15 XP awarded per challenge
            </p>
          </div>
        </div>

        {/* Card 4: Lessons Completed */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analyses Performed</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-display font-black text-slate-900">
              {recentAnalyses.length}
            </p>
            <p className="text-xs text-purple-600 font-medium mt-3">
              Deep evaluations generated
            </p>
          </div>
        </div>
      </div>

      {/* Media Trends Section (Recharts) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs mb-8 animate-fade-in" id="media-trends-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#0057A8] rounded-2xl">
              <BarChart3 className="h-6 w-6 text-[#0057A8]" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-slate-800">Media Misinformation Trends</h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Frequency analysis of manipulation tactics identified across your {recentAnalyses.length} evaluated claims
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setChartView('bar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartView === 'bar'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              id="trend-bar-toggle"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Risk Factors
            </button>
            <button
              onClick={() => setChartView('pie')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartView === 'pie'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              id="trend-pie-toggle"
            >
              <PieChartIcon className="h-3.5 w-3.5" />
              Source Trust
            </button>
          </div>
        </div>

        {/* Recharts Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'bar' ? (
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                    formatter={(value: any) => [`${value} Flagged Claims`, 'Frequency']}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={38}>
                    {trendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={credibilityPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {credibilityPieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                      border: 'none'
                    }}
                    formatter={(value: any) => [`${value} Reports`, 'Count']}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Trend Insights Callout Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              Primary Threat Vector
            </div>
            
            <div>
              <p className="text-2xl font-black font-display text-slate-800">
                {topMisinfoVector.name}
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Detected in <strong className="text-slate-800 font-bold">{topMisinfoVector.count} of {recentAnalyses.length}</strong> evaluated reports. Misinformation publishers heavily rely on this tactic to provoke immediate engagement.
              </p>
            </div>

            <div className="border-t border-slate-200/60 pt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Outrage vs Clickbait:</span>
                <span className="font-bold text-slate-800">
                  {trendData[0].count} / {trendData[1].count}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Low Source Credibility:</span>
                <span className="font-bold font-mono text-rose-600">
                  {trendData[2].count} claims
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Recent Analyses & Quick Actions */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Quick Actions */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('analyze')}
                className="w-full flex items-center justify-between p-3.5 bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50 hover:border-blue-200 text-slate-800 rounded-xl text-left transition-all duration-200 cursor-pointer"
                id="quick-action-analyze"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-white rounded-lg text-primary shadow-xs">🧭</span>
                  <div>
                    <p className="font-bold text-sm text-slate-800">Analyze Content</p>
                    <p className="text-xs text-slate-400">Evaluate text, claim or URL</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('learn')}
                className="w-full flex items-center justify-between p-3.5 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/50 hover:border-emerald-200 text-slate-800 rounded-xl text-left transition-all duration-200 cursor-pointer"
                id="quick-action-challenge"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-white rounded-lg text-secondary shadow-xs">🎯</span>
                  <div>
                    <p className="font-bold text-sm text-slate-800">Start Challenge</p>
                    <p className="text-xs text-slate-400">Take Today's A/B Lesson</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className="w-full flex items-center justify-between p-3.5 bg-purple-50/50 hover:bg-purple-50 border border-purple-100/50 hover:border-purple-200 text-slate-800 rounded-xl text-left transition-all duration-200 cursor-pointer"
                id="quick-action-history"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-white rounded-lg text-purple-600 shadow-xs">📜</span>
                  <div>
                    <p className="font-bold text-sm text-slate-800">View History</p>
                    <p className="text-xs text-slate-400">Review former scorecards</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Recent Analyses */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Recent Analyses</h3>
              <button
                onClick={() => setActiveTab('history')}
                className="text-xs font-bold text-[#0057A8] hover:underline"
              >
                See all
              </button>
            </div>
            {recentAnalyses.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Clock className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No analyses generated yet</p>
                <button
                  onClick={() => setActiveTab('analyze')}
                  className="mt-3 text-xs font-bold text-[#0057A8] hover:underline"
                >
                  Analyze your first claim
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAnalyses.slice(0, 3).map((report) => (
                  <button
                    key={report.id}
                    onClick={() => onSelectRecentAnalysis(report)}
                    className="w-full text-left p-3 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold text-sm text-slate-800 truncate">{report.claim}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          report.sourceCredibility === 'High' ? 'bg-emerald-50 text-emerald-700' :
                          report.sourceCredibility === 'Medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          Credibility: {report.sourceCredibility}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(report.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right column (Col-span 2): Algorithmic Bias Simulator */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden h-full flex flex-col justify-between">
            <div>
              {/* Badge & Title */}
              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                <AlertCircle className="h-3.5 w-3.5" />
                UNESCO Core MIL Module
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-black text-slate-800 mb-2">
                Algorithmic Feed Bias Simulator
              </h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Social media feeds are not neutral channels. They are optimized for engagement and click revenue. Adjust the platform metrics below to see how feed algorithms alter the narrative density of your community.
              </p>

              {/* Sliders Container */}
              <div className="space-y-5 bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6">
                
                {/* Outrage Multiplier */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      Sensationalism Boost <span className="text-rose-500 font-mono">(Outrage Factor)</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-sm">
                      {sensationalismBoost}x amplification
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sensationalismBoost}
                    onChange={(e) => setSensationalismBoost(Number(e.target.value))}
                    className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>1x (Pure facts)</span>
                    <span>5x (Click-baited)</span>
                    <span>10x (Conspiracy Outrage)</span>
                  </div>
                </div>

                {/* Confirmation Filter Strength */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Confirmation Filter Strength <span className="text-[#0057A8] font-mono">(Echo Chamber)</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-[#0057A8] bg-blue-50 px-2 py-0.5 rounded-sm">
                      {filterStrength}% Echo Density
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filterStrength}
                    onChange={(e) => setFilterStrength(Number(e.target.value))}
                    className="w-full accent-[#0057A8] h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>0% (Diverse Opinions)</span>
                    <span>50% (Slight Bias)</span>
                    <span>100% (No Contradictions)</span>
                  </div>
                </div>

                {/* Commercial Bias Select */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    Commercial Profit Intent (Ad-sponsored override)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'High'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setCommercialBias(level as any)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          commercialBias === level
                            ? 'bg-amber-100 border-amber-300 text-amber-800 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {level} Profit Target
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Simulated Live Feed Output */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Simulated Community Feed Results:</p>
              <div className="space-y-3">
                {feed.map((post) => (
                  <div
                    key={post.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      post.type === 'outrage' ? 'bg-rose-50/40 border-rose-100/50' :
                      post.type === 'commercial' ? 'bg-amber-50/40 border-amber-100/50' :
                      post.type === 'curiosity' ? 'bg-blue-50/40 border-blue-100/50' : 'bg-slate-50/40 border-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-bold text-slate-800 leading-snug">{post.headline}</p>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm font-bold shrink-0 ${
                        post.type === 'outrage' ? 'bg-rose-100 text-rose-700' :
                        post.type === 'commercial' ? 'bg-amber-100 text-amber-700' :
                        post.type === 'curiosity' ? 'bg-blue-100 text-[#0057A8]' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {post.category}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2.5 text-[10px] text-slate-400">
                      <span className="font-semibold">{post.source}</span>
                      <span className="font-mono">{post.metrics}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100/50 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-medium">Algorithmic Impact:</span>
                      <span className={`text-[10px] font-bold ${
                        post.type === 'outrage' ? 'text-rose-600' :
                        post.type === 'commercial' ? 'text-amber-600' : 'text-[#0057A8]'
                      }`}>{post.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
