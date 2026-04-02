// Editor Types
export interface PersonalInfo {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  date: string;
  description: string;
}

export interface Education {
  id: number;
  degree: string;
  school: string;
  date: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  date: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  skills: string[];
}

export type TemplateType = 'modern' | 'classic' | 'creative' | 'minimal' | 'executive';

export interface FillTemplateResponse {
  resume_id: string;
  data: ResumeData;
}

export interface AIWriteResponse {
  generated_text: string;
  section_type: string;
}

// Cover Letter Types
export interface CoverLetterData {
  recipientName: string;
  companyName: string;
  date: string;
  greeting: string;
  opening: string;
  body: string[];
  closing: string;
  signOff: string;
  senderName: string;
}

export interface GenerateCoverLetterResponse {
  resume_id: string;
  cover_letter: CoverLetterData;
}

export interface RefineParagraphResponse {
  refined_text: string;
  paragraph_type: string;
}

export interface SavedResumeResponse {
  id: string;
  title: string;
  template: TemplateType;
  resume_data: ResumeData;
  source_resume_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedCoverLetterResponse {
  id: string;
  resume_id: string | null;
  company_name: string;
  tone: string;
  cover_letter: CoverLetterData;
  created_at: string;
  updated_at: string;
}
