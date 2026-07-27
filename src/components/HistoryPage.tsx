/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Clock, Search, ArrowRight, AlertCircle, Trash2, Filter, 
  Stethoscope, Landmark, Atom, Cpu, Globe, ArrowUpDown, 
  Plus, Pencil, X, Save, Check, ShieldCheck, Tag, Sparkles
} from 'lucide-react';
import { CompassReport, CredibilityLevel, EvidenceLevel, EmotionalLevel, BiasLevel, ClickbaitLevel } from '../types';

interface HistoryPageProps {
  analyses: CompassReport[];
  onSelectAnalysis: (report: CompassReport) => void;
  onClearHistory: () => void;
  onCreateReport?: (newReport: CompassReport) => void;
  onUpdateReport?: (updatedReport: CompassReport) => void;
  onDeleteReport?: (reportId: string) => void;
}

// Derive category from report or fallback keyword analysis
export const getReportCategory = (report: CompassReport): string => {
  if (report.category) return report.category;
  const text = (report.claim + ' ' + report.aiLesson + ' ' + (report.contentType || '')).toLowerCase();
  if (text.includes('health') || text.includes('cancer') || text.includes('cure') || text.includes('doctor') || text.includes('herb') || text.includes('medical') || text.includes('vaccine') || text.includes('hospital')) {
    return 'Health';
  }
  if (text.includes('election') || text.includes('ballot') || text.includes('political') || text.includes('vote') || text.includes('government') || text.includes('court') || text.includes('law')) {
    return 'Politics';
  }
  if (text.includes('nasa') || text.includes('space') || text.includes('kepler') || text.includes('alien') || text.includes('science') || text.includes('climate') || text.includes('planet') || text.includes('physics')) {
    return 'Science';
  }
  if (text.includes('ai') || text.includes('tech') || text.includes('algorithm') || text.includes('digital') || text.includes('social media') || text.includes('app')) {
    return 'Technology';
  }
  return 'General';
};

const CATEGORIES = [
  { id: 'All', label: 'All Categories', icon: Globe },
  { id: 'Health', label: 'Health', icon: Stethoscope },
  { id: 'Politics', label: 'Politics', icon: Landmark },
  { id: 'Science', label: 'Science', icon: Atom },
  { id: 'Technology', label: 'Technology', icon: Cpu },
  { id: 'General', label: 'General', icon: Filter },
];

const DEFAULT_FORM: Partial<CompassReport> = {
  claim: '',
  category: 'General',
  sourceCredibility: 'Medium',
  sourceCredibilityReasoning: 'Standard digital source requiring verification.',
  evidenceStrength: 'Moderate',
  evidenceStrengthReasoning: 'Presents partial citations or indirect references.',
  emotionalManipulation: 'Moderate',
  emotionalManipulationReasoning: 'Contains persuasive emotional messaging.',
  biasIndicator: 'Medium',
  biasIndicatorReasoning: 'Shows framed perspective on the issue.',
  clickbaitRisk: 'Low',
  clickbaitRiskReasoning: 'Headline adheres to factual format.',
  verificationSteps: [
    'Check primary source domain and publisher credentials',
    'Cross-reference claim against fact-checking databases'
  ],
  aiLesson: 'Evaluate source credentials and underlying evidence before sharing.',
  reflectionQuestion: 'What additional independent evidence would confirm or refute this claim?',
  inputSource: 'text'
};

export default function HistoryPage({
  analyses,
  onSelectAnalysis,
  onClearHistory,
  onCreateReport,
  onUpdateReport,
  onDeleteReport
}: HistoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'risk'>('newest');

  // Modal State for Create & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<CompassReport | null>(null);
  const [formData, setFormData] = useState<Partial<CompassReport>>(DEFAULT_FORM);
  const [verificationStepsText, setVerificationStepsText] = useState<string>('');

  // Delete Confirmation State
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: analyses.length };
    CATEGORIES.forEach(cat => { if (cat.id !== 'All') counts[cat.id] = 0; });

    analyses.forEach(report => {
      const cat = getReportCategory(report);
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return counts;
  }, [analyses]);

  // Filter and sort reports
  const filteredAnalyses = useMemo(() => {
    let result = analyses.filter((report) => {
      const category = getReportCategory(report);
      const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
      const matchesSearch =
        report.claim.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.aiLesson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      if (sortBy === 'risk') {
        const riskScore = (r: CompassReport) => {
          let score = 0;
          if (r.emotionalManipulation === 'High') score += 3;
          if (r.clickbaitRisk === 'High') score += 3;
          if (r.sourceCredibility === 'Low') score += 3;
          return score;
        };
        return riskScore(b) - riskScore(a);
      }
      return 0;
    });
  }, [analyses, searchTerm, selectedCategory, sortBy]);

  const handleOpenCreateModal = () => {
    setEditingReport(null);
    setFormData(DEFAULT_FORM);
    setVerificationStepsText(DEFAULT_FORM.verificationSteps?.join('\n') || '');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e: React.MouseEvent, report: CompassReport) => {
    e.stopPropagation();
    setEditingReport(report);
    setFormData({
      ...report,
      category: getReportCategory(report)
    });
    setVerificationStepsText((report.verificationSteps || []).join('\n'));
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.claim?.trim()) return;

    const parsedSteps = verificationStepsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingReport) {
      // Update
      const updated: CompassReport = {
        ...editingReport,
        claim: formData.claim.trim(),
        category: formData.category || 'General',
        sourceCredibility: (formData.sourceCredibility as CredibilityLevel) || 'Medium',
        sourceCredibilityReasoning: formData.sourceCredibilityReasoning || '',
        evidenceStrength: (formData.evidenceStrength as EvidenceLevel) || 'Moderate',
        evidenceStrengthReasoning: formData.evidenceStrengthReasoning || '',
        emotionalManipulation: (formData.emotionalManipulation as EmotionalLevel) || 'Moderate',
        emotionalManipulationReasoning: formData.emotionalManipulationReasoning || '',
        biasIndicator: (formData.biasIndicator as BiasLevel) || 'Medium',
        biasIndicatorReasoning: formData.biasIndicatorReasoning || '',
        clickbaitRisk: (formData.clickbaitRisk as ClickbaitLevel) || 'Low',
        clickbaitRiskReasoning: formData.clickbaitRiskReasoning || '',
        verificationSteps: parsedSteps.length > 0 ? parsedSteps : ['Verify with official sources'],
        aiLesson: formData.aiLesson || 'Analyze source before sharing.',
        reflectionQuestion: formData.reflectionQuestion || 'What evidence confirms this claim?'
      };

      if (onUpdateReport) {
        onUpdateReport(updated);
      }
    } else {
      // Create
      const newReport: CompassReport = {
        id: 'report-' + Math.random().toString(36).substring(2, 9),
        claim: formData.claim.trim(),
        category: formData.category || 'General',
        sourceCredibility: (formData.sourceCredibility as CredibilityLevel) || 'Medium',
        sourceCredibilityReasoning: formData.sourceCredibilityReasoning || 'Custom created claim.',
        evidenceStrength: (formData.evidenceStrength as EvidenceLevel) || 'Moderate',
        evidenceStrengthReasoning: formData.evidenceStrengthReasoning || 'Requires secondary verification.',
        emotionalManipulation: (formData.emotionalManipulation as EmotionalLevel) || 'Moderate',
        emotionalManipulationReasoning: formData.emotionalManipulationReasoning || 'Contains persuasive text.',
        biasIndicator: (formData.biasIndicator as BiasLevel) || 'Medium',
        biasIndicatorReasoning: formData.biasIndicatorReasoning || 'Presents a specific viewpoint.',
        clickbaitRisk: (formData.clickbaitRisk as ClickbaitLevel) || 'Low',
        clickbaitRiskReasoning: formData.clickbaitRiskReasoning || 'Standard headline structure.',
        verificationSteps: parsedSteps.length > 0 ? parsedSteps : ['Cross-reference with reputable databases'],
        aiLesson: formData.aiLesson || 'Evaluate source credentials prior to sharing.',
        reflectionQuestion: formData.reflectionQuestion || 'What evidence would verify this claim?',
        timestamp: new Date().toISOString(),
        inputSource: 'text'
      };

      if (onCreateReport) {
        onCreateReport(newReport);
      }
    }

    setIsModalOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation();
    setDeletingReportId(reportId);
  };

  const confirmDelete = (reportId: string) => {
    if (onDeleteReport) {
      onDeleteReport(reportId);
    }
    setDeletingReportId(null);
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Health':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Politics':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Science':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Technology':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Health': return '🩺';
      case 'Politics': return '🏛️';
      case 'Science': return '🔬';
      case 'Technology': return '💻';
      default: return '🧭';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="history-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Analysis Archive</h1>
          <p className="text-slate-500 mt-1">Manage, edit, and organize your media literacy scorecard reports.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Create Button */}
          {onCreateReport && (
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-1.5 bg-[#0057A8] hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              id="add-custom-report-btn"
            >
              <Plus className="h-4 w-4" />
              <span>Add Custom Report</span>
            </button>
          )}

          {/* Purge All Button */}
          {analyses.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to purge your local analysis archive? This action cannot be undone.")) {
                  onClearHistory();
                }
              }}
              className="flex items-center gap-1.5 text-rose-500 hover:text-rose-700 font-semibold text-xs border border-rose-100 hover:bg-rose-50 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              id="clear-archive-btn"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Purge Archive</span>
            </button>
          )}
        </div>
      </div>

      {analyses.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl p-8 shadow-xs">
          <div className="p-4 bg-slate-50 text-slate-400 rounded-full w-fit mx-auto mb-4 border border-slate-100">
            <Clock className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your Archive is Empty</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto mb-6">
            Analyze headlines on the Workspace page or create custom report entries to build your media literacy journal.
          </p>
          {onCreateReport && (
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 bg-[#0057A8] hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
              id="empty-create-report-btn"
            >
              <Plus className="h-4 w-4" />
              Create First Report
            </button>
          )}
        </div>
      ) : (
        /* Active State */
        <div className="space-y-6">
          
          {/* Category Filter Pills Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              <span>Filter by Topic Category</span>
              <span>{filteredAnalyses.length} of {analyses.length} Reports</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" id="category-filter-pills">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const count = categoryCounts[cat.id] || 0;
                const isActive = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#0057A8] text-white border-[#0057A8] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    id={`category-pill-${cat.id.toLowerCase()}`}
                  >
                    <IconComponent className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-blue-800 text-blue-100'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search bar & Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search claims, lessons, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-400 rounded-2xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all text-xs sm:text-sm shadow-xs"
                id="history-search-input"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-1.5 shrink-0 shadow-xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer pr-1"
                id="history-sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="risk">Highest Risk</option>
              </select>
            </div>
          </div>

          {/* Filtered Empty State */}
          {filteredAnalyses.length === 0 ? (
            <div className="text-center py-12 bg-white border border-dashed border-slate-200 rounded-3xl p-6">
              <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">No claims match your current filter</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Try switching categories or clearing search terms to see your full archive.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                id="reset-history-filters-btn"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Analysis Cards List */
            <div className="space-y-4">
              {filteredAnalyses.map((report) => {
                const category = getReportCategory(report);
                const categoryIcon = getCategoryIcon(category);
                const categoryBadgeClass = getCategoryBadgeStyle(category);
                const isConfirmingDelete = deletingReportId === report.id;

                return (
                  <div
                    key={report.id}
                    onClick={() => onSelectAnalysis(report)}
                    className="w-full text-left bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group cursor-pointer relative overflow-hidden"
                  >
                    {/* Item Body */}
                    <div className="space-y-2 truncate max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Category Badge */}
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${categoryBadgeClass}`}>
                          <span>{categoryIcon}</span>
                          <span>{category}</span>
                        </span>

                        {/* Input Source Badge */}
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          report.inputSource === 'url' ? 'bg-blue-100 text-[#0057A8]' :
                          report.inputSource === 'image' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {report.inputSource}
                        </span>

                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(report.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-primary transition-colors truncate">
                        "{report.claim}"
                      </h3>

                      <p className="text-xs text-slate-500 leading-relaxed font-semibold italic truncate">
                        Lesson: {report.aiLesson}
                      </p>
                    </div>

                    {/* Actions & Buttons */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right hidden md:block">
                        <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          report.sourceCredibility === 'High' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          report.sourceCredibility === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          Trust: {report.sourceCredibility}
                        </span>
                      </div>

                      {/* Edit Button */}
                      {onUpdateReport && (
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditModal(e, report)}
                          className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-[#0057A8] rounded-xl border border-slate-200/80 transition-colors cursor-pointer"
                          title="Edit scorecard details"
                          id={`edit-report-btn-${report.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}

                      {/* Delete Button / Inline Delete Confirmation */}
                      {onDeleteReport && (
                        isConfirmingDelete ? (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2 py-1 rounded-xl"
                          >
                            <span className="text-[10px] font-bold text-rose-700">Delete?</span>
                            <button
                              type="button"
                              onClick={() => confirmDelete(report.id)}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded-md text-[10px] font-bold cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingReportId(null)}
                              className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md text-[10px] font-bold cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteClick(e, report.id)}
                            className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl border border-slate-200/80 transition-colors cursor-pointer"
                            title="Delete report"
                            id={`delete-report-btn-${report.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )
                      )}

                      {/* Arrow to View */}
                      <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-primary transition-colors">
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="report-form-modal">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-[#0057A8] rounded-xl">
                  {editingReport ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingReport ? 'Edit Scorecard Report' : 'Create Custom Analysis Report'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingReport ? 'Update report evaluations and takeaways.' : 'Add a manual claim evaluation to your archive.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              
              {/* Claim Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Claim Headline / Topic <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sensational study claims coffee cures insomnia in 2 hours"
                  value={formData.claim || ''}
                  onChange={(e) => setFormData({ ...formData, claim: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:border-[#0057A8] focus:bg-white transition-all text-xs"
                />
              </div>

              {/* Category & Source Credibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category || 'General'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#0057A8] focus:bg-white cursor-pointer text-xs"
                  >
                    <option value="Health">🩺 Health</option>
                    <option value="Politics">🏛️ Politics</option>
                    <option value="Science">🔬 Science</option>
                    <option value="Technology">💻 Technology</option>
                    <option value="General">🧭 General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source Credibility Level</label>
                  <select
                    value={formData.sourceCredibility || 'Medium'}
                    onChange={(e) => setFormData({ ...formData, sourceCredibility: e.target.value as CredibilityLevel })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#0057A8] focus:bg-white cursor-pointer text-xs"
                  >
                    <option value="High">High Trust</option>
                    <option value="Medium">Medium Trust</option>
                    <option value="Low">Low / Unverified Trust</option>
                    <option value="Unknown">Unknown Source</option>
                  </select>
                </div>
              </div>

              {/* Evidence Strength & Emotional Risk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Evidence Strength</label>
                  <select
                    value={formData.evidenceStrength || 'Moderate'}
                    onChange={(e) => setFormData({ ...formData, evidenceStrength: e.target.value as EvidenceLevel })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#0057A8] focus:bg-white cursor-pointer text-xs"
                  >
                    <option value="Strong">Strong Evidence</option>
                    <option value="Moderate">Moderate Evidence</option>
                    <option value="Weak">Weak / No Citation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Outrage / Emotional Manipulation Risk</label>
                  <select
                    value={formData.emotionalManipulation || 'Moderate'}
                    onChange={(e) => setFormData({ ...formData, emotionalManipulation: e.target.value as EmotionalLevel })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-[#0057A8] focus:bg-white cursor-pointer text-xs"
                  >
                    <option value="Low">Low Emotional Hook</option>
                    <option value="Moderate">Moderate Emotional Hook</option>
                    <option value="High">High Outrage / Alarmist</option>
                  </select>
                </div>
              </div>

              {/* AI Media Literacy Takeaway / Lesson */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Media Literacy Takeaway / Lesson
                </label>
                <textarea
                  rows={2}
                  placeholder="Key principle to remember when reading similar claims..."
                  value={formData.aiLesson || ''}
                  onChange={(e) => setFormData({ ...formData, aiLesson: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800 focus:outline-none focus:border-[#0057A8] focus:bg-white transition-all text-xs"
                />
              </div>

              {/* Verification Steps (One per line) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Verification Steps (One step per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Step 1: Check primary source domain&#10;Step 2: Cross-reference on Lead Stories or Snopes"
                  value={verificationStepsText}
                  onChange={(e) => setVerificationStepsText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-slate-800 focus:outline-none focus:border-[#0057A8] focus:bg-white transition-all text-xs"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-[#0057A8] hover:bg-blue-800 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs shadow-xs"
                >
                  <Save className="h-4 w-4" />
                  {editingReport ? 'Save Changes' : 'Create Report'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
