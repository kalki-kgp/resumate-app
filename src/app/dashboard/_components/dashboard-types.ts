/* Dashboard-specific types (API responses, onboarding state, etc.) */

export type Stage = 'onboarding' | 'workspace';
export type OnboardingPhase = 'choice' | 'steps';
export type OnboardingPath = 'upload' | 'create';

export type DashboardSection =
  | 'overview'
  | 'resumes'
  | 'cover-letters'
  | 'templates'
  | 'analytics'
  | 'ai-insights'
  | 'job-match'
  | 'ai-assistant'
  | 'ai-experiments'
  | 'faq'
  | 'settings';

export type OnboardingStep = {
  index: number;
  title: string;
  description: string;
  action: string;
};

export type ResumeAnalysisRole = {
  title: string;
  reason: string;
};

export type ResumeAnalysisBullet = {
  original: string;
  improved: string;
};

export type ResumeAnalysisCategoryScores = {
  impact: number | null;
  brevity: number | null;
  style: number | null;
  soft_skills: number | null;
};

export type ResumeAnalysisSectionScores = {
  headline: number | null;
  summary: number | null;
  experience: number | null;
  education: number | null;
};

export type ResumeAnalysisResult = {
  candidate_headline: string | null;
  summary: string | null;
  ats_score_estimate: number | null;
  category_scores: ResumeAnalysisCategoryScores | null;
  section_scores: ResumeAnalysisSectionScores | null;
  strengths: string[];
  gaps: string[];
  priority_fixes: string[];
  keywords_to_add: string[];
  recommended_roles: ResumeAnalysisRole[];
  improved_bullets: ResumeAnalysisBullet[];
  confidence_note: string | null;
  raw_response: string | null;
  analyzed_at: string | null;
};

export type OnboardingStateResponse = {
  stage: Stage;
  phase: OnboardingPhase;
  selected_path: OnboardingPath | null;
  current_step: number;
  target_role: string | null;
  steps: OnboardingStep[];
  analysis: ResumeAnalysisResult | null;
  updated_at: string;
};

export type AnalyzeResumeResponse = {
  onboarding: OnboardingStateResponse;
  analysis: ResumeAnalysisResult;
};

export type DashboardResume = {
  id: string;
  filename: string;
  title: string;
  uploaded_at: string;
  file_size_bytes: number;
  analysis: ResumeAnalysisResult | null;
  thumbnail_url: string | null;
};

export type UploadResumeResponse = DashboardResume;
export type AnalyzeDashboardResumeResponse = DashboardResume;

export type DashboardCoverLetter = {
  id: string;
  company_name: string;
  tone: string;
  sender_name: string;
  created_at: string;
};

export type DashboardResponse = {
  display_name: string;
  target_role: string | null;
  selected_resume_id: string | null;
  resumes: DashboardResume[];
  cover_letters: DashboardCoverLetter[];
};

export type MeResponse = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
};

export type ExampleJob = {
  id: string;
  title: string;
  company: string;
  match: number;
  type: string;
  reason?: string;
};
