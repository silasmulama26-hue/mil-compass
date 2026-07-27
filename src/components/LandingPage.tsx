/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Brain, TrendingUp, Compass, ChevronRight, HelpCircle, ShieldCheck, Cpu } from 'lucide-react';

interface LandingPageProps {
  onStartAnalyzing: () => void;
  onLearnMore: () => void;
}

export default function LandingPage({ onStartAnalyzing, onLearnMore }: LandingPageProps) {
  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 sm:py-24">
        {/* Decorative Grid and Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-100 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-50 blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#0057A8] rounded-full px-4 py-1.5 text-xs font-semibold mb-6 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            UNESCO MIL Hackathon Edition
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
            MIL <span className="text-[#0057A8]">Compass</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl font-semibold text-[#0057A8] mb-4 font-display">
            Navigate Information. Empower Decisions.
          </p>

          {/* Description */}
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            MIL Compass is an AI-powered Media and Information Literacy platform that helps people think critically before believing or sharing digital information.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onStartAnalyzing}
              className="w-full sm:w-auto bg-[#0057A8] hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-base flex items-center justify-center gap-2 group"
              id="landing-cta-analyze"
            >
              Start Analyzing
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLearnMore}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-base flex items-center justify-center"
              id="landing-cta-learn"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800">
            How MIL Compass Guides You
          </h2>
          <p className="text-slate-500 mt-2">
            Instead of telling you what is true or false, we teach you how to evaluate the digital landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-xs hover:shadow-md transition-all duration-200 group">
            <div className="p-4 bg-blue-50 text-[#0057A8] w-fit rounded-xl mb-6 group-hover:scale-105 transition-transform">
              <Search className="h-6 w-6 text-[#0057A8]" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Analyze Information</h3>
            <p className="text-slate-500 leading-relaxed">
              Analyze news articles, social media claims, and WhatsApp forwards using our interactive AI evaluation model.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-xs hover:shadow-md transition-all duration-200 group">
            <div className="p-4 bg-emerald-50 text-[#2E7D32] w-fit rounded-xl mb-6 group-hover:scale-105 transition-transform">
              <Brain className="h-6 w-6 text-[#2E7D32]" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Learn Critical Thinking</h3>
            <p className="text-slate-500 leading-relaxed">
              Understand the mechanisms of misleading information. Learn to spot loaded words, cognitive biases, and logical fallacies.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-xs hover:shadow-md transition-all duration-200 group">
            <div className="p-4 bg-amber-50 text-[#F9A825] w-fit rounded-xl mb-6 group-hover:scale-105 transition-transform">
              <TrendingUp className="h-6 w-6 text-[#F9A825]" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Track Your Progress</h3>
            <p className="text-slate-500 leading-relaxed">
              Earn experience points, maintain daily streaks, and secure exclusive badges as you level up your digital literacy.
            </p>
          </div>
        </div>
      </div>

      {/* UNESCO Hackathon Showcase Section */}
      <div className="bg-white border-t border-b border-slate-100 py-12 my-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-800 mb-4">
                The Media & Information Literacy Compass
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                In a digital world flooded with hyper-personalized content, filter bubbles, and synthetic media, raw fact-checking is no longer enough. MIL Compass equips citizens with cognitive tools, empowering them to detect manipulative intent, source bias, and emotional framing independently.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-blue-50 rounded-lg text-primary">
                    <ShieldCheck className="h-5 w-5 text-[#0057A8]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Source Credibility Over Fast Labels</h4>
                    <p className="text-sm text-slate-500">We analyze patterns, verifying origin details, references, and intent metrics.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-amber-50 rounded-lg text-accent">
                    <Cpu className="h-5 w-5 text-[#F9A825]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">AI-Guided Analytical Reflection</h4>
                    <p className="text-sm text-slate-500">Engage with prompt reflection questions to test your confidence and evaluate evidence strength.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 p-8 flex items-center justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100 rounded-full blur-2xl opacity-40"></div>
              <div className="relative flex flex-col items-center text-center p-6 bg-white border border-slate-100 shadow-xl rounded-xl max-w-sm">
                <Compass className="h-16 w-16 text-[#0057A8] mb-4 animate-pulse" />
                <h3 className="text-lg font-bold text-slate-800">Algorithmic Bias Modeling</h3>
                <p className="text-xs text-slate-500 mt-2 mb-4">
                  Interact with real-time variables to see how social media feeds leverage outrage and clickbait to keep you engaged.
                </p>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0057A8] h-full w-3/4"></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-mono">Cognitive Autonomy Index: 84%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-[#0057A8]" />
              <span className="font-display font-bold text-lg text-white">
                MIL <span className="text-[#0057A8]">Compass</span>
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <button onClick={() => onLearnMore()} className="hover:text-white transition-colors">Curriculum</button>
              <button onClick={onStartAnalyzing} className="hover:text-white transition-colors">Analyzer</button>
              <span className="text-slate-700">|</span>
              <span className="text-slate-500 font-mono text-xs">Developed in partnership with global MIL educators</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              &copy; 2026 MIL Compass. UNESCO MIL Hackathon. Empowering media autonomy.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
