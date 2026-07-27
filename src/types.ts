/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CredibilityLevel = 'Unknown' | 'Low' | 'Medium' | 'High';
export type EvidenceLevel = 'Weak' | 'Moderate' | 'Strong';
export type EmotionalLevel = 'None' | 'Low' | 'Moderate' | 'High';
export type BiasLevel = 'Low' | 'Medium' | 'High';
export type ClickbaitLevel = 'Low' | 'Medium' | 'High';

export interface CompassReport {
  id: string;
  claim: string;
  category?: string;
  sourceCredibility: CredibilityLevel;
  sourceCredibilityReasoning: string;
  evidenceStrength: EvidenceLevel;
  evidenceStrengthReasoning: string;
  emotionalManipulation: EmotionalLevel;
  emotionalManipulationReasoning: string;
  biasIndicator: BiasLevel;
  biasIndicatorReasoning: string;
  clickbaitRisk: ClickbaitLevel;
  clickbaitRiskReasoning: string;
  verificationSteps: string[];
  aiLesson: string;
  reflectionQuestion: string;
  reflectionAnswer?: string;
  confidenceScore?: number; // 0-100
  timestamp: string;
  inputSource: 'text' | 'url' | 'image';
  contentType?: string;
}

export interface Challenge {
  id: string;
  question: string;
  optionA: {
    title: string;
    description: string;
    isTrustworthy: boolean;
  };
  optionB: {
    title: string;
    description: string;
    isTrustworthy: boolean;
  };
  explanation: string;
  xpReward: number;
}

export interface UserProgress {
  score: number; // Critical Thinking Score (84/100)
  xp: number;
  level: string; // "Truth Explorer"
  streak: number; // 5
  challengesCompleted: number;
  badges: string[];
  lessonsCompleted: number;
}
