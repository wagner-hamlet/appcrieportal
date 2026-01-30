
export interface WorkshopEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
  speaker?: string;
  type: string; 
  timestamp: number;
  facultyBody?: string;
  dailySummary?: string;
  coverTitle?: string;
  coverTitle2?: string;
  subtitle?: string;
  subInicial?: string;
}

export interface DailySummary {
  message: string;
  highlight: string;
}

export enum ViewMode {
  HOME = 'home',
  DASHBOARD = 'dashboard',
  SCHEDULE = 'schedule',
  INFO = 'info'
}

export type CourseType = 'SCHOOL' | 'JUMPSTART' | 'EXPERIENCE';

export interface Course {
  id: CourseType;
  name: string;
  subtitle: string;
  sheetId: string;
  icon: string;
}
