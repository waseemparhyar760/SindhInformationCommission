
export enum AppView {
  HOME = 'home',
  FILE_COMPLAINT = 'file-complaint',
  RESOURCES = 'resources',
  STAFF = 'staff',
  STATISTICS = 'statistics',
  INFO_DESK = 'info-desk',
  HEARINGS_LIST = 'hearings-list',
  CAREERS = 'careers',
  TRACK_COMPLAINT = 'track-complaint',
  GALLERY = 'gallery',
  ANNUAL_REPORTS = 'annual-reports',
  BUDGET = 'budget',
  ABOUT = 'about',
  NOTIFICATIONS = 'notifications'
}

export enum Language {
  EN = 'en',
  SD = 'sd',
  UR = 'ur'
}

export interface RTIRequest {
  id: string;
  department: string;
  subject: string;
  description: string;
  status: 'Draft' | 'Submitted' | 'Processing' | 'Closed';
  date: string;
  initial_request_date?: string;
  internal_review_date?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnnualReport {
  id: number;
  title: string;
  pdf_file: string;
  created_at: string;
  updated_at: string;
}
