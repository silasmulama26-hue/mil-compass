/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, Check, ArrowLeft, Info, HelpCircle, Award, Sparkles, Share2, Copy, CheckCircle2, X, ChevronDown, ChevronRight, ShieldCheck, Trash2, Printer } from 'lucide-react';
import { CompassReport } from '../types';

interface CompassReportPageProps {
  report: CompassReport;
  onBack: () => void;
  onComplete: (reflectionAnswer: string, confidenceScore: number) => void;
  onUpdateReport?: (updatedReport: CompassReport) => void;
  onDeleteReport?: (reportId: string) => void;
}

export default function CompassReportPage({ report, onBack, onComplete, onDeleteReport }: CompassReportPageProps) {
  const [reflection, setReflection] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(50);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStepAccordion = (index: number) => {
    setActiveStepIndex(prev => (prev === index ? null : index));
  };

  const toggleStepCompleted = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedSteps(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // Format summary text for social media sharing
  const generateShareText = () => {
    return `🧭 MIL Compass Literacy Report

Claim evaluated: "${report.claim}"

📊 Analytical Breakdown:
• Source Trust: ${report.sourceCredibility}
• Evidence Strength: ${report.evidenceStrength}
• Outrage Risk: ${report.emotionalManipulation}
• Clickbait Risk: ${report.clickbaitRisk}

💡 Media Literacy Takeaway:
"${report.aiLesson}"

Learn critical thinking & cognitive sovereignty with MIL Compass!
#MediaLiteracy #CriticalThinking #FactCheck #MILCompass`;
  };

  const handleCopySummary = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `MIL Compass Report: ${report.claim}`,
          text: generateShareText(),
        });
      } catch (err) {
        console.error('Native share closed or failed:', err);
      }
    } else {
      handleCopySummary();
    }
  };

  // Helper to color badge based on rating
  const getBadgeStyle = (metric: string, value: string) => {
    const val = value.toLowerCase();
    if (metric === 'credibility') {
      if (val === 'high') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      if (val === 'medium') return 'bg-amber-50 text-amber-700 border-amber-100';
      return 'bg-rose-50 text-rose-700 border-rose-100';
    }
    if (metric === 'evidence') {
      if (val === 'strong') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      if (val === 'moderate') return 'bg-amber-50 text-amber-700 border-amber-100';
      return 'bg-rose-50 text-rose-700 border-rose-100';
    }
    if (metric === 'manipulation' || metric === 'bias' || metric === 'clickbait') {
      if (val === 'none' || val === 'low') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      if (val === 'moderate' || val === 'medium') return 'bg-amber-50 text-amber-700 border-amber-100';
      return 'bg-rose-50 text-rose-700 border-rose-100';
    }
    return 'bg-slate-50 text-slate-700 border-slate-100';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflection) return;
    setHasCompleted(true);
    onComplete(reflection, confidence);
  };

  const shareTextEncoded = encodeURIComponent(generateShareText());

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="compass-report-view">
      
      {/* Top Header Controls: Back & Actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold group cursor-pointer print:hidden"
          id="report-back-btn"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Workspace
        </button>

        <div className="flex items-center gap-2">
          {onDeleteReport && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this scorecard report from your archive?")) {
                  onDeleteReport(report.id);
                }
              }}
              className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer print:hidden"
              id="delete-report-btn"
              title="Delete this report"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer print:hidden"
            id="download-pdf-btn"
            title="Generate formatted PDF report"
          >
            <Printer className="h-4 w-4 text-slate-600" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-[#0057A8] border border-blue-200 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer print:hidden"
            id="share-report-btn"
          >
            <Share2 className="h-4 w-4 text-[#0057A8]" />
            Share Lesson Summary
          </button>
        </div>
      </div>

      {/* Main Report Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden mb-8">
        
        {/* Banner */}
        <div className="bg-slate-900 px-6 sm:px-8 py-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 text-[#F9A825] rounded-xl">
              <Compass className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-black tracking-tight">Compass Report</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">MEDIA & LITERACY COGNITIVE SCORECARD</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-full font-mono">
              ID: #{report.id.substring(0, 8)}
            </span>
            <button
              onClick={() => setShowShareModal(true)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer sm:hidden"
              title="Share Report"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Claim Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <span className="text-[10px] font-bold text-[#0057A8] uppercase tracking-widest block mb-1">CLAIM UNDER ANALYSIS</span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 italic leading-relaxed">
            "{report.claim}"
          </h2>
        </div>

        {/* Metric Scorecards Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">MIL Analytical Scorecards</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Card 1: Source Credibility */}
            <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Source Trust</p>
                <span className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle('credibility', report.sourceCredibility)}`}>
                  {report.sourceCredibility}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug mt-3 border-t border-slate-200/50 pt-2 font-medium">
                {report.sourceCredibilityReasoning.length > 80 ? report.sourceCredibilityReasoning.substring(0, 80) + '...' : report.sourceCredibilityReasoning}
              </p>
            </div>

            {/* Card 2: Evidence Strength */}
            <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Evidence</p>
                <span className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle('evidence', report.evidenceStrength)}`}>
                  {report.evidenceStrength}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug mt-3 border-t border-slate-200/50 pt-2 font-medium">
                {report.evidenceStrengthReasoning.length > 80 ? report.evidenceStrengthReasoning.substring(0, 80) + '...' : report.evidenceStrengthReasoning}
              </p>
            </div>

            {/* Card 3: Emotional Manipulation */}
            <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Outrage Risk</p>
                <span className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle('manipulation', report.emotionalManipulation)}`}>
                  {report.emotionalManipulation}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug mt-3 border-t border-slate-200/50 pt-2 font-medium">
                {report.emotionalManipulationReasoning.length > 80 ? report.emotionalManipulationReasoning.substring(0, 80) + '...' : report.emotionalManipulationReasoning}
              </p>
            </div>

            {/* Card 4: Bias Indicator */}
            <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bias Level</p>
                <span className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle('bias', report.biasIndicator)}`}>
                  {report.biasIndicator}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug mt-3 border-t border-slate-200/50 pt-2 font-medium">
                {report.biasIndicatorReasoning.length > 80 ? report.biasIndicatorReasoning.substring(0, 80) + '...' : report.biasIndicatorReasoning}
              </p>
            </div>

            {/* Card 5: Clickbait Risk */}
            <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clickbait Risk</p>
                <span className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle('clickbait', report.clickbaitRisk)}`}>
                  {report.clickbaitRisk}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug mt-3 border-t border-slate-200/50 pt-2 font-medium">
                {report.clickbaitRiskReasoning.length > 80 ? report.clickbaitRiskReasoning.substring(0, 80) + '...' : report.clickbaitRiskReasoning}
              </p>
            </div>

          </div>

          {/* Deep-dive Detailed Descriptions of Findings */}
          <div className="mt-8 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed Analysis Findings</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="space-y-4 text-xs leading-relaxed text-slate-600">
                <div>
                  <p className="font-bold text-slate-800">Source Credibility & Editorial Context</p>
                  <p className="mt-1">{report.sourceCredibilityReasoning}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-800">Evidence Strength & Empirical Validation</p>
                  <p className="mt-1">{report.evidenceStrengthReasoning}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-600">
                <div>
                  <p className="font-bold text-slate-800">Linguistic Triggers & Emotional Tone</p>
                  <p className="mt-1">{report.emotionalManipulationReasoning}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-800">Cognitive & Commercial Bias Anchors</p>
                  <p className="mt-1">{report.biasIndicatorReasoning}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Verification Accordion */}
          <div className="mt-8 border-t border-slate-100 pt-6" id="verification-accordion-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="p-1 bg-[#0057A8] text-white rounded-lg flex items-center justify-center">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  Actionable Verification Methodology
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Do not take our analysis at face value. Expand each verification checkpoint to focus on one action at a time.
                </p>
              </div>

              {/* Progress counter */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto">
                <span className="text-xs font-semibold text-slate-500">Progress:</span>
                <span className="text-xs font-mono font-bold text-[#0057A8]">
                  {completedSteps.length} / {report.verificationSteps.length} Verified
                </span>
                <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden ml-1">
                  <div
                    className="bg-[#0057A8] h-full transition-all duration-300"
                    style={{ width: `${(completedSteps.length / (report.verificationSteps.length || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Accordion List */}
            <div className="space-y-3">
              {report.verificationSteps.map((step, idx) => {
                const isOpen = activeStepIndex === idx;
                const isChecked = completedSteps.includes(idx);

                return (
                  <div
                    key={idx}
                    className={`border rounded-2xl transition-all overflow-hidden ${
                      isOpen
                        ? 'border-[#0057A8] bg-white shadow-xs ring-1 ring-blue-100'
                        : isChecked
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Accordion Header */}
                    <div
                      onClick={() => toggleStepAccordion(idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleStepAccordion(idx);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className="w-full text-left p-4 flex items-center justify-between gap-3 cursor-pointer select-none focus:outline-hidden"
                      id={`verification-step-header-${idx}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Step Checkbox / Circle */}
                        <button
                          type="button"
                          onClick={(e) => toggleStepCompleted(idx, e)}
                          className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white border-2 border-slate-300 text-transparent hover:border-[#0057A8]'
                          }`}
                          title={isChecked ? 'Mark as incomplete' : 'Mark as completed'}
                          id={`step-checkbox-${idx}`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </button>

                        <span className="text-xs font-mono font-bold text-[#0057A8] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md shrink-0">
                          Step {idx + 1}
                        </span>

                        <span className={`text-xs font-bold truncate ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {step}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isChecked && (
                          <span className="hidden sm:inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                        <div className={`p-1 rounded-lg text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-blue-50 text-[#0057A8]' : ''}`}>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Accordion Content Panel */}
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-600 space-y-3 animate-fade-in" id={`step-content-${idx}`}>
                        <div className="p-3.5 bg-white border border-slate-100 rounded-xl leading-relaxed text-slate-700 font-medium shadow-2xs">
                          <p className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 text-xs">
                            <ShieldCheck className="h-4 w-4 text-[#0057A8]" />
                            Recommended Audit Action:
                          </p>
                          <p className="text-slate-600 text-xs leading-relaxed">{step}</p>
                        </div>

                        {/* Practical Action Tips & Step Advancement */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                          <div className="text-[11px] text-slate-500 font-medium">
                            💡 <strong className="text-slate-700">MIL Practice:</strong> Check domain metadata, primary research releases, or cross-party news archives before sharing.
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <button
                              type="button"
                              onClick={(e) => toggleStepCompleted(idx, e)}
                              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                              }`}
                              id={`step-toggle-btn-${idx}`}
                            >
                              <Check className="h-3.5 w-3.5" />
                              {isChecked ? 'Unmark Verification' : 'Mark Step Verified'}
                            </button>

                            {idx < report.verificationSteps.length - 1 && (
                              <button
                                type="button"
                                onClick={() => setActiveStepIndex(idx + 1)}
                                className="px-3.5 py-1.5 bg-[#0057A8] hover:bg-blue-800 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                id={`step-next-btn-${idx}`}
                              >
                                Next Step
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Educational Lesson Banner */}
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
            <div className="p-2.5 bg-white text-[#0057A8] rounded-xl shadow-2xs h-fit shrink-0">
              <Sparkles className="h-5 w-5 text-[#0057A8]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0057A8] uppercase tracking-wider">Compass AI Literacy Lesson</p>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold mt-1">
                {report.aiLesson}
              </p>
            </div>
          </div>

          {/* User Interaction Module (Duolingo-style Lesson Submission) */}
          <div className="mt-8 border-t border-slate-100 pt-6 bg-slate-50/50 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[#F9A825]" />
              Interactive Evaluation & Confidence Check
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Reflection Question (Radio buttons) */}
              <div>
                <p className="text-sm font-bold text-slate-700 mb-3">{report.reflectionQuestion}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'No', label: '❌ No, it violates MIL safeguards' },
                    { value: 'Maybe', label: '⚠️ Maybe, after manual verification' },
                    { value: 'Yes', label: '✅ Yes, seems fully substantiated' }
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-4 border rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        reflection === opt.value
                          ? 'bg-blue-50 border-blue-300 text-[#0057A8] font-bold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reflection"
                        value={opt.value}
                        checked={reflection === opt.value}
                        onChange={(e) => setReflection(e.target.value)}
                        className="sr-only"
                        disabled={hasCompleted}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Confidence Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-bold text-slate-700">
                    Confidence Meter: <span className="text-[#0057A8]">How accurate do you think this claim is?</span>
                  </p>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-sm">
                    {confidence}% accuracy belief
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  disabled={hasCompleted}
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>0% (Absolute Falsehood)</span>
                  <span>50% (Ambiguous/Undecided)</span>
                  <span>100% (Absolute Fact)</span>
                </div>
              </div>

              {/* Complete Lesson CTA */}
              {!hasCompleted ? (
                <button
                  type="submit"
                  disabled={!reflection}
                  className="w-full bg-[#2E7D32] hover:bg-green-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
                  id="complete-lesson-btn"
                >
                  <Award className="h-4 w-4" />
                  Complete Lesson (+15 XP)
                </button>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center text-emerald-800 font-bold text-sm animate-fade-in">
                  🎉 Scorecard Lesson Completed! Kevin has been awarded +15 XP and his streak remains secure.
                </div>
              )}

            </form>
          </div>

        </div>

      </div>

      {/* Share Summary Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in" id="share-modal-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-[#0057A8] rounded-xl">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-slate-800 text-lg">Share Literacy Summary</h3>
                  <p className="text-xs text-slate-400">Spread critical thinking across social media</p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                id="close-share-modal-btn"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Generated Summary Preview Box */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Generated Text Summary
              </label>
              <textarea
                readOnly
                value={generateShareText()}
                rows={9}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-700 leading-relaxed resize-none focus:outline-none shadow-inner"
                id="share-summary-textarea"
              />
            </div>

            {/* Actions: Copy & Native Share */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleCopySummary}
                className={`w-full py-3 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0057A8] hover:bg-blue-800 text-white'
                }`}
                id="copy-share-text-btn"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-white" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Text Summary
                  </>
                )}
              </button>

              {'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                  id="native-share-btn"
                >
                  <Share2 className="h-4 w-4" />
                  System Share
                </button>
              )}
            </div>

            {/* Social Media Platform Quick Links */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
                Quick Share to Social Platforms
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareTextEncoded}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-center text-xs font-bold text-slate-700 hover:text-[#0057A8] transition-all flex flex-col items-center justify-center gap-1"
                  id="share-twitter-link"
                >
                  <span className="text-base">𝕏</span>
                  <span>Twitter / X</span>
                </a>

                <a
                  href={`https://api.whatsapp.com/send?text=${shareTextEncoded}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-center text-xs font-bold text-slate-700 hover:text-emerald-700 transition-all flex flex-col items-center justify-center gap-1"
                  id="share-whatsapp-link"
                >
                  <span className="text-base">💬</span>
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://www.linkedin.com/feed/?shareActive=true&text=${shareTextEncoded}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-center text-xs font-bold text-slate-700 hover:text-[#0057A8] transition-all flex flex-col items-center justify-center gap-1"
                  id="share-linkedin-link"
                >
                  <span className="text-base">💼</span>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
