export interface ResumeData {
  id: string;
  filename: string;
  originalText: string;
  filePath: string;
  fileType: "pdf" | "docx" | "txt";
  sections: ResumeSection[];
  createdAt: string;
}

export interface ResumeSection {
  heading: string;
  content: string;
  bulletPoints: string[];
}

export interface JobDescription {
  text: string;
  tokens: string[];
  keywords: Keyword[];
}

export interface Keyword {
  term: string;
  stem: string;
  category: KeywordCategory;
  weight: number;
}

export type KeywordCategory =
  | "technical_skill"
  | "soft_skill"
  | "qualification"
  | "domain_knowledge"
  | "tool"
  | "other";