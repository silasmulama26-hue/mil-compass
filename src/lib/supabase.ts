/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, User, Session } from '@supabase/supabase-js';
import { CompassReport } from '../types';

// Helper to check for Supabase environment variables safely
const getSupabaseEnv = () => {
  const meta = import.meta as any;
  const envUrl = meta?.env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const envKey = meta?.env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  return { url: envUrl, key: envKey };
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseEnv();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'MY_SUPABASE_URL' && 
  supabaseUrl.startsWith('http')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Maps Supabase database row to CompassReport
 */
export function mapRowToReport(row: any): CompassReport {
  return {
    id: row.id,
    claim: row.claim || '',
    category: row.category || undefined,
    sourceCredibility: row.source_credibility || 'Unknown',
    sourceCredibilityReasoning: row.source_credibility_reasoning || '',
    evidenceStrength: row.evidence_strength || 'Weak',
    evidenceStrengthReasoning: row.evidence_strength_reasoning || '',
    emotionalManipulation: row.emotional_manipulation || 'None',
    emotionalManipulationReasoning: row.emotional_manipulation_reasoning || '',
    biasIndicator: row.bias_indicator || 'Low',
    biasIndicatorReasoning: row.bias_indicator_reasoning || '',
    clickbaitRisk: row.clickbait_risk || 'Low',
    clickbaitRiskReasoning: row.clickbait_risk_reasoning || '',
    verificationSteps: Array.isArray(row.verification_steps) ? row.verification_steps : [],
    aiLesson: row.ai_lesson || '',
    reflectionQuestion: row.reflection_question || '',
    reflectionAnswer: row.reflection_answer || undefined,
    confidenceScore: row.confidence_score !== null && row.confidence_score !== undefined ? Number(row.confidence_score) : undefined,
    timestamp: row.timestamp || new Date().toISOString(),
    inputSource: row.input_source || 'text',
    contentType: row.content_type || undefined,
  };
}

/**
 * Maps CompassReport to Supabase database row format
 */
export function mapReportToRow(report: CompassReport, userId: string): any {
  return {
    id: report.id,
    user_id: userId,
    claim: report.claim,
    category: report.category || null,
    source_credibility: report.sourceCredibility,
    source_credibility_reasoning: report.sourceCredibilityReasoning,
    evidence_strength: report.evidenceStrength,
    evidence_strength_reasoning: report.evidenceStrengthReasoning,
    emotional_manipulation: report.emotionalManipulation,
    emotional_manipulation_reasoning: report.emotionalManipulationReasoning,
    bias_indicator: report.biasIndicator,
    bias_indicator_reasoning: report.biasIndicatorReasoning,
    clickbait_risk: report.clickbaitRisk,
    clickbait_risk_reasoning: report.clickbaitRiskReasoning,
    verification_steps: report.verificationSteps,
    ai_lesson: report.aiLesson,
    reflection_question: report.reflectionQuestion,
    reflection_answer: report.reflectionAnswer || null,
    confidence_score: report.confidenceScore !== undefined ? report.confidenceScore : null,
    timestamp: report.timestamp,
    input_source: report.inputSource,
    content_type: report.contentType || null,
  };
}

/**
 * Supabase Archive/History Database Operations
 */

export async function fetchSupabaseReports(userId: string): Promise<CompassReport[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('compass_reports')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching Supabase reports:', error.message);
      return null;
    }

    return (data || []).map(mapRowToReport);
  } catch (err) {
    console.error('Failed to query Supabase compass_reports:', err);
    return null;
  }
}

export async function saveSupabaseReport(report: CompassReport, userId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapReportToRow(report, userId);
    const { error } = await supabase
      .from('compass_reports')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('Error saving Supabase report:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save to Supabase compass_reports:', err);
    return false;
  }
}

export async function deleteSupabaseReport(reportId: string, userId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('compass_reports')
      .delete()
      .eq('id', reportId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting Supabase report:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete Supabase report:', err);
    return false;
  }
}

export async function syncLocalReportsToSupabase(localReports: CompassReport[], userId: string): Promise<void> {
  if (!supabase || !localReports.length) return;
  try {
    const rows = localReports.map((r) => mapReportToRow(r, userId));
    const { error } = await supabase
      .from('compass_reports')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('Error syncing local reports to Supabase:', error.message);
    }
  } catch (err) {
    console.error('Error during bulk sync to Supabase:', err);
  }
}

/**
 * SQL Schema script to assist users setting up Supabase table
 */
export const SUPABASE_SQL_SCHEMA = `-- Execute this SQL snippet in your Supabase SQL Editor:
create table if not exists compass_reports (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  claim text not null,
  category text,
  source_credibility text,
  source_credibility_reasoning text,
  evidence_strength text,
  evidence_strength_reasoning text,
  emotional_manipulation text,
  emotional_manipulation_reasoning text,
  bias_indicator text,
  bias_indicator_reasoning text,
  clickbait_risk text,
  clickbait_risk_reasoning text,
  verification_steps jsonb,
  ai_lesson text,
  reflection_question text,
  reflection_answer text,
  confidence_score integer,
  timestamp text not null,
  input_source text,
  content_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table compass_reports enable row level security;

-- RLS Policies for logged-in users
create policy "Users can view their own reports" on compass_reports
  for select using (auth.uid() = user_id);

create policy "Users can insert their own reports" on compass_reports
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own reports" on compass_reports
  for update using (auth.uid() = user_id);

create policy "Users can delete their own reports" on compass_reports
  for delete using (auth.uid() = user_id);
`;
