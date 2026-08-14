/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import DashboardPage from './components/DashboardPage';
import AnalyzePage from './components/AnalyzePage';
import CompassReportPage from './components/CompassReportPage';
import LearnPage from './components/LearnPage';
import HistoryPage from './components/HistoryPage';
import ProfilePage from './components/ProfilePage';
import SupabaseAuthModal from './components/SupabaseAuthModal';
import { UserProgress, CompassReport } from './types';
import { analyzeClaimContent } from './lib/analyzer';
import { 
  supabase, 
  isSupabaseConfigured, 
  fetchSupabaseReports, 
  saveSupabaseReport, 
  deleteSupabaseReport, 
  syncLocalReportsToSupabase 
} from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const LOCAL_STORAGE_KEY_PROGRESS = 'mil_compass_progress';
const LOCAL_STORAGE_KEY_REPORTS = 'mil_compass_reports';

const DEFAULT_PROGRESS: UserProgress = {
  score: 84,
  xp: 120,
  level: "Truth Explorer",
  streak: 5,
  challengesCompleted: 18,
  lessonsCompleted: 10,
  badges: ["Critical Thinker", "Fact Finder", "Truth Explorer"]
};

// High-quality preloaded demonstration reports to bootstrap Kevin's dashboard
const DEFAULT_REPORTS: CompassReport[] = [
  {
    id: 'report-nasa',
    claim: "NASA Classified Kepler-452b alien cover-up admitted!",
    category: 'Science',
    sourceCredibility: 'Low',
    sourceCredibilityReasoning: "The claims are published on a sensationalist blog masquerading as a scientific journal. Standard NASA discoveries are always published directly on NASA's main portal (.gov) and through peer-reviewed astrophysics publications first.",
    evidenceStrength: 'Weak',
    evidenceStrengthReasoning: "The claim states 'classified sources confirm' but provides no scientific data, spectra analysis, or peer-reviewed citations. It misinterprets normal planetary atmospheric gas readings as definitive 'technosignatures'.",
    emotionalManipulation: 'High',
    emotionalManipulationReasoning: "Uses dramatic exclamation marks and explosive words ('Unprecedented!', 'Earth-shaking coverup!') to trigger excitement and shock, designed to override standard scientific skepticism.",
    biasIndicator: 'Medium',
    biasIndicatorReasoning: "The claim relies on 'Anti-Establishment Bias'—the presupposition that scientific organizations are actively hiding truth from the general public, drawing users into conspiracy thinking.",
    clickbaitRisk: 'High',
    clickbaitRiskReasoning: "The title uses an absolute hook ('NASA Finally Admits Alien Life Exists!') to create a severe information gap, forcing users to click through or share without checking the fine print.",
    verificationSteps: [
      "Visit nasa.gov or hubblesite.org directly to search for Kepler atmospheric research updates.",
      "Check fact-checking websites like Snopes or Lead Stories for recent space rumors.",
      "Look up the name of the scientist quoted to verify if they exist and actually work in astrobiology.",
      "Review the original peer-reviewed paper on Kepler-452b atmospheric modeling to see actual readings."
    ],
    aiLesson: "The 'Curiosity Gap' is a powerful engagement tactic. Discrepancies between sensationalist headlines and the actual body of scientific evidence are a classic signature of misinformation.",
    reflectionQuestion: "How does our innate human desire to discover alien life make us more vulnerable to sharing space-related rumors?",
    inputSource: 'text',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString() // 1 day ago
  },
  {
    id: 'report-health',
    claim: "Dandelion herb extract cancer cure in 48 hours WhatsApp forward",
    category: 'Health',
    sourceCredibility: 'Low',
    sourceCredibilityReasoning: "Often spreads via anonymous forwards on social networks. There is no editorial gatekeeping, medical board review, or professional attribution, which are vital for medical claims.",
    evidenceStrength: 'Weak',
    evidenceStrengthReasoning: "Claims of a '100% cure rate' rely entirely on an unlinked in-vitro (petri dish) study. In medical research, substances killing cells in petri dishes do not translate to safe, effective cures in humans.",
    emotionalManipulation: 'High',
    emotionalManipulationReasoning: "Creates a dangerous false sense of hope for vulnerable patients and stokes anger against professional oncologists by claiming a 'secret industry coverup'.",
    biasIndicator: 'High',
    biasIndicatorReasoning: "Appeals heavily to 'Naturalness Bias'—the false cognitive shortcut that natural substances are inherently safe and always superior to synthesized, researched medical therapies.",
    clickbaitRisk: 'High',
    clickbaitRiskReasoning: "Uses sensational hooks ('Oncologists hate this simple herb!') to exploit desperation and drive sharing, feeding the social media engagement algorithms.",
    verificationSteps: [
      "Search the National Cancer Institute (cancer.gov) or WHO for clinical evidence on the substance.",
      "Verify if the source is selling supplements or herbal extracts on the same domain (commercial motive).",
      "Consult with an oncologist or medical professional about standard peer-reviewed treatment pathways.",
      "Examine the 'anonymous expert' quoted to see if they hold valid medical credentials in oncology."
    ],
    aiLesson: "Medical misinformation often exploits 'Naturalness Bias' and patient desperation. Reliable medical treatments must pass rigorous, transparent clinical trials with human subjects before being certified.",
    reflectionQuestion: "If someone delays real medical therapy because of this WhatsApp post, what are the potential real-world consequences?",
    inputSource: 'text',
    timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString() // 3 days ago
  },
  {
    id: 'report-election',
    claim: "Tens of thousands of unregistered ballots found in regional recount",
    category: 'Politics',
    sourceCredibility: 'Low',
    sourceCredibilityReasoning: "Originates from a highly partisan hyper-partisan Twitter account with no physical address, staff directory, or journalistic corrections policy. It presents rumors as verified facts.",
    evidenceStrength: 'Weak',
    evidenceStrengthReasoning: "The only evidence is an blurry, uncontextualized 5-second video of election workers moving standard mailing boxes. There are no official police filings, court records, or bipartisan auditor reports.",
    emotionalManipulation: 'High',
    emotionalManipulationReasoning: "Designed to evoke extreme tribal anger, fear of disenfranchisement, and mistrust in democratic processes, which are highly viral social emotions.",
    biasIndicator: 'High',
    biasIndicatorReasoning: "Exploits 'Confirmation Bias' and 'In-group/Out-group Bias', framing election operations in a hostile way to validate the user's political fears.",
    clickbaitRisk: 'High',
    clickbaitRiskReasoning: "Framed as an urgent crisis ('BREAKING: MASSIVE FRAUD UNCOVERED!') to bypass logical analysis and provoke immediate, emotional retweets.",
    verificationSteps: [
      "Check announcements from the local, bipartisan Board of Elections or Secretary of State office.",
      "Find the source of the video using a reverse-video search to determine when and where it was taken.",
      "Compare reports from mainstream news organizations across different political spectra.",
      "Verify if any legal filings or formal complaints have been registered with the regional courts."
    ],
    aiLesson: "In times of high political tension, social media algorithms heavily boost content that triggers partisan outrage. Outrage is the primary vector of democratic polarization.",
    reflectionQuestion: "How does spreading unverified election claims before they are audited affect our community's trust in democracy?",
    inputSource: 'text',
    timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() // 5 days ago
  }
];

// Helper to compute URL path + search params for a given tab and report
const getUrlForTabAndReport = (tab: string, report: CompassReport | null): string => {
  let path = '/';
  if (tab === 'dashboard') path = '/dashboard';
  else if (tab === 'analyze') path = '/analyze';
  else if (tab === 'learn') path = '/learn';
  else if (tab === 'history') path = '/history';
  else if (tab === 'profile') path = '/profile';
  else if (tab === 'report') {
    path = report ? `/report?id=${encodeURIComponent(report.id)}` : '/analyze';
  } else {
    path = '/landing';
  }
  return path;
};

// Helper to parse current location to tab and report ID
const parseLocation = (allReports: CompassReport[]): { tab: string; report: CompassReport | null } => {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace(/^#\/?/, '');

  let tab = '';
  let reportId = searchParams.get('id') || searchParams.get('reportId') || '';

  // Match pathname
  if (pathname === '/' || pathname === '/landing') {
    tab = 'landing';
  } else if (pathname === '/dashboard') {
    tab = 'dashboard';
  } else if (pathname === '/analyze') {
    tab = 'analyze';
  } else if (pathname === '/learn') {
    tab = 'learn';
  } else if (pathname === '/history') {
    tab = 'history';
  } else if (pathname === '/profile') {
    tab = 'profile';
  } else if (pathname.startsWith('/report')) {
    tab = 'report';
    const sub = pathname.replace('/report', '').replace(/^\//, '');
    if (sub && !reportId) {
      reportId = decodeURIComponent(sub);
    }
  }

  // Fallback to query param `tab` or `page` if tab not matched by pathname
  if (!tab && (searchParams.get('tab') || searchParams.get('page'))) {
    tab = searchParams.get('tab') || searchParams.get('page') || '';
  }

  // Fallback to hash if present
  if (!tab && hash) {
    const [hashTab, hashQuery] = hash.split('?');
    if (['landing', 'dashboard', 'analyze', 'learn', 'history', 'profile', 'report'].includes(hashTab)) {
      tab = hashTab;
      if (hashQuery) {
        const hashParams = new URLSearchParams(hashQuery);
        if (!reportId) reportId = hashParams.get('id') || '';
      }
    }
  }

  const validTabs = ['landing', 'dashboard', 'analyze', 'learn', 'history', 'profile', 'report'];
  if (!validTabs.includes(tab)) {
    tab = 'landing';
  }

  let matchedReport: CompassReport | null = null;
  if (reportId) {
    matchedReport = allReports.find(r => r.id === reportId) || null;
  }

  if (tab === 'report' && !matchedReport) {
    if (allReports.length > 0) {
      matchedReport = allReports[0];
    } else {
      tab = 'analyze';
    }
  }

  return { tab, report: matchedReport };
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [recentAnalyses, setRecentAnalyses] = useState<CompassReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CompassReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Supabase Auth & Cloud Sync State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const recentAnalysesRef = React.useRef<CompassReport[]>(recentAnalyses);
  useEffect(() => {
    recentAnalysesRef.current = recentAnalyses;
  }, [recentAnalyses]);

  // Load Cloud Reports from Supabase
  const loadCloudReports = async (user: User) => {
    const cloudReports = await fetchSupabaseReports(user.id);
    if (cloudReports !== null) {
      if (cloudReports.length > 0) {
        setRecentAnalyses(cloudReports);
        recentAnalysesRef.current = cloudReports;
        localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(cloudReports));
      } else if (recentAnalysesRef.current.length > 0) {
        // First time cloud user with existing local reports: sync them up to Supabase!
        await syncLocalReportsToSupabase(recentAnalysesRef.current, user.id);
      }
    }
  };

  // Initialize Supabase Auth session listener
  useEffect(() => {
    if (!supabase) return;

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user || null;
      setCurrentUser(user);
      if (user) {
        loadCloudReports(user);
      }
    });

    // Subscribe to auth state transitions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      if (user) {
        loadCloudReports(user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle navigation while updating URL path
  const handleNavigate = (newTab: string, report: CompassReport | null = null, replace = false) => {
    let targetReport = report;
    if (newTab === 'report' && !targetReport) {
      targetReport = selectedReport || recentAnalysesRef.current[0] || null;
    }

    setActiveTab(newTab);
    if (newTab === 'report') {
      setSelectedReport(targetReport);
    } else if (report) {
      setSelectedReport(report);
    }

    const targetUrl = getUrlForTabAndReport(newTab, newTab === 'report' ? targetReport : null);
    const currentFull = window.location.pathname + window.location.search;

    if (currentFull !== targetUrl) {
      if (replace) {
        window.history.replaceState({ tab: newTab, reportId: targetReport?.id }, '', targetUrl);
      } else {
        window.history.pushState({ tab: newTab, reportId: targetReport?.id }, '', targetUrl);
      }
    }
  };

  // Load from local storage and sync URL on initial mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY_PROGRESS);
    const savedReports = localStorage.getItem(LOCAL_STORAGE_KEY_REPORTS);

    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {
        setProgress(DEFAULT_PROGRESS);
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROGRESS, JSON.stringify(DEFAULT_PROGRESS));
    }

    let loadedReports = DEFAULT_REPORTS;
    if (savedReports) {
      try {
        loadedReports = JSON.parse(savedReports);
      } catch (e) {
        loadedReports = DEFAULT_REPORTS;
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(DEFAULT_REPORTS));
    }

    setRecentAnalyses(loadedReports);
    recentAnalysesRef.current = loadedReports;

    // Parse current URL to restore exact view on page load / refresh
    const { tab, report } = parseLocation(loadedReports);
    setActiveTab(tab);
    if (report) {
      setSelectedReport(report);
    }

    // Set canonical URL in browser history
    const canonicalUrl = getUrlForTabAndReport(tab, report);
    const currentFull = window.location.pathname + window.location.search;
    if (currentFull !== canonicalUrl) {
      window.history.replaceState({ tab, reportId: report?.id }, '', canonicalUrl);
    }
  }, []);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const { tab, report } = parseLocation(recentAnalysesRef.current);
      setActiveTab(tab);
      setSelectedReport(report);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleAnalyze = async (content: string, type: 'text' | 'url' | 'image') => {
    setIsAnalyzing(true);
    handleNavigate('analyze');

    let result: any = null;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type })
      });

      if (response.ok) {
        result = await response.json();
      } else {
        console.warn(`API server returned ${response.status}. Falling back to local analyzer.`);
      }
    } catch (err) {
      console.warn('API server fetch failed. Falling back to local analyzer.', err);
    }

    // If API endpoint was unreachable or returned non-200, use local analyzer
    if (!result) {
      try {
        result = await analyzeClaimContent(content, type);
      } catch (fallbackErr) {
        console.error('Fallback analyzer error:', fallbackErr);
      }
    }

    if (result) {
      const newReport: CompassReport = {
        id: 'report-' + Math.random().toString(36).substr(2, 9),
        claim: result.claim || content.substring(0, 60),
        sourceCredibility: result.sourceCredibility || 'Unknown',
        sourceCredibilityReasoning: result.sourceCredibilityReasoning || 'Verification required.',
        evidenceStrength: result.evidenceStrength || 'Weak',
        evidenceStrengthReasoning: result.evidenceStrengthReasoning || 'Insufficient citations.',
        emotionalManipulation: result.emotionalManipulation || 'Moderate',
        emotionalManipulationReasoning: result.emotionalManipulationReasoning || 'Urgency elements detected.',
        biasIndicator: result.biasIndicator || 'Medium',
        biasIndicatorReasoning: result.biasIndicatorReasoning || 'Balanced viewpoints omitted.',
        clickbaitRisk: result.clickbaitRisk || 'Low',
        clickbaitRiskReasoning: result.clickbaitRiskReasoning || '',
        verificationSteps: result.verificationSteps || ['Compare news sources', 'Verify author credentials'],
        aiLesson: result.aiLesson || 'Analyze prior to amplification.',
        reflectionQuestion: result.reflectionQuestion || 'Would you forward this to a group?',
        timestamp: new Date().toISOString(),
        inputSource: type
      };

      const updatedReports = [newReport, ...recentAnalyses];
      setRecentAnalyses(updatedReports);
      localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(updatedReports));

      // Sync to Supabase if authenticated
      if (currentUser) {
        saveSupabaseReport(newReport, currentUser.id);
      }

      // Award points for generating an analysis
      const updatedProgress = {
        ...progress,
        xp: progress.xp + 10,
        score: Math.min(progress.score + 1, 100)
      };
      setProgress(updatedProgress);
      localStorage.setItem(LOCAL_STORAGE_KEY_PROGRESS, JSON.stringify(updatedProgress));

      handleNavigate('report', newReport);
      triggerToast("✨ Scorecard compiled successfully! +10 XP awarded.");
    } else {
      triggerToast("❌ Unable to compile analysis report. Please try again.");
    }

    setIsAnalyzing(false);
  };

  const handleCompleteLesson = (reflectionAnswer: string, confidenceScore: number) => {
    if (!selectedReport) return;

    const updatedReport = { ...selectedReport, reflectionAnswer, confidenceScore };

    // Update report with user reflection answers
    const updatedReports = recentAnalyses.map((r) =>
      r.id === selectedReport.id ? updatedReport : r
    );
    setRecentAnalyses(updatedReports);
    localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(updatedReports));

    if (currentUser) {
      saveSupabaseReport(updatedReport, currentUser.id);
    }

    // Increase user progress metrics
    const updatedProgress: UserProgress = {
      ...progress,
      xp: progress.xp + 15,
      score: Math.min(progress.score + 2, 100),
      challengesCompleted: progress.challengesCompleted + 1,
      lessonsCompleted: progress.lessonsCompleted + 1
    };

    setProgress(updatedProgress);
    localStorage.setItem(LOCAL_STORAGE_KEY_PROGRESS, JSON.stringify(updatedProgress));

    triggerToast("🎉 Lesson completed! Kevin Jenkins gained +15 XP and +2 Critical Thinking Rank!");
    handleNavigate('dashboard');
  };

  const handleAnswerChallenge = (xpAward: number) => {
    const updatedProgress: UserProgress = {
      ...progress,
      xp: progress.xp + xpAward,
      score: Math.min(progress.score + 3, 100),
      challengesCompleted: progress.challengesCompleted + 1
    };

    // Unlock final detective badge on milestone
    if (updatedProgress.challengesCompleted >= 20 && !updatedProgress.badges.includes("Media Detective")) {
      updatedProgress.badges = [...updatedProgress.badges, "Media Detective"];
      triggerToast("🏆 ACHIEVEMENT UNLOCKED: 'Media Detective' badge awarded!");
    } else {
      triggerToast(`🎯 Correct selection! +${xpAward} XP awarded to your portfolio.`);
    }

    setProgress(updatedProgress);
    localStorage.setItem(LOCAL_STORAGE_KEY_PROGRESS, JSON.stringify(updatedProgress));
  };

  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    setRecentAnalyses(DEFAULT_REPORTS);
    localStorage.setItem(LOCAL_STORAGE_KEY_PROGRESS, JSON.stringify(DEFAULT_PROGRESS));
    localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(DEFAULT_REPORTS));
    setSelectedReport(null);
    handleNavigate('dashboard');
    triggerToast("🔄 Demo environment restored successfully.");
  };

  const handleClearHistory = () => {
    setRecentAnalyses([]);
    localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify([]));
    triggerToast("🗑️ Local scorecard archive purged.");
  };

  const handleCreateReport = (newReport: CompassReport) => {
    const updatedReports = [newReport, ...recentAnalyses];
    setRecentAnalyses(updatedReports);
    localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(updatedReports));

    if (currentUser) {
      saveSupabaseReport(newReport, currentUser.id);
    }

    triggerToast("📝 Custom analysis scorecard added to archive.");
  };

  const handleUpdateReport = (updatedReport: CompassReport) => {
    const updatedReports = recentAnalyses.map(r => r.id === updatedReport.id ? updatedReport : r);
    setRecentAnalyses(updatedReports);
    localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(updatedReports));

    if (selectedReport?.id === updatedReport.id) {
      setSelectedReport(updatedReport);
    }

    if (currentUser) {
      saveSupabaseReport(updatedReport, currentUser.id);
    }

    triggerToast("✏️ Scorecard report updated successfully.");
  };

  const handleDeleteReport = (reportId: string) => {
    const updatedReports = recentAnalyses.filter(r => r.id !== reportId);
    setRecentAnalyses(updatedReports);
    localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(updatedReports));

    if (selectedReport?.id === reportId) {
      setSelectedReport(null);
      handleNavigate('history');
    }

    if (currentUser) {
      deleteSupabaseReport(reportId, currentUser.id);
    }

    triggerToast("🗑️ Scorecard report removed from archive.");
  };

  const handleSelectRecentAnalysis = (report: CompassReport) => {
    handleNavigate('report', report);
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setCurrentUser(null);
      triggerToast("👋 Signed out from Supabase account.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      
      {/* Sticky top navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => handleNavigate(tab)}
        progress={progress}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Supabase Authentication & Cloud Sync Modal */}
      <SupabaseAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(user, msg) => {
          setCurrentUser(user);
          if (msg) triggerToast(msg);
        }}
        onSignOut={handleSignOut}
      />

      {/* Floating Success Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3 border border-slate-800 animate-slide-up max-w-sm">
          <div className="p-1.5 bg-emerald-500 rounded-lg text-white">
            <CheckCircle2 className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-xs font-semibold leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* Main Pages Content Routing */}
      <main className="grow">
        {activeTab === 'landing' && (
          <LandingPage
            onStartAnalyzing={() => handleNavigate('analyze')}
            onLearnMore={() => handleNavigate('learn')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            progress={progress}
            recentAnalyses={recentAnalyses}
            setActiveTab={(tab) => handleNavigate(tab)}
            onSelectRecentAnalysis={handleSelectRecentAnalysis}
          />
        )}

        {activeTab === 'analyze' && (
          <AnalyzePage
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === 'report' && selectedReport && (
          <CompassReportPage
            report={selectedReport}
            onBack={() => handleNavigate('history')}
            onComplete={handleCompleteLesson}
            onUpdateReport={handleUpdateReport}
            onDeleteReport={handleDeleteReport}
          />
        )}

        {activeTab === 'learn' && (
          <LearnPage
            progress={progress}
            onAnswerChallenge={handleAnswerChallenge}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            analyses={recentAnalyses}
            onSelectAnalysis={handleSelectRecentAnalysis}
            onClearHistory={handleClearHistory}
            onCreateReport={handleCreateReport}
            onUpdateReport={handleUpdateReport}
            onDeleteReport={handleDeleteReport}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage
            progress={progress}
            onResetProgress={handleResetProgress}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

    </div>
  );
}
