
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

export interface Partner {
  id: string;
  name: string;
  category: string;
  description: string;
  whatsapp: string;
  instagram: string;
  imageUrl: string;
}

export interface DailySummary {
  message: string;
  highlight: string;
}

export enum ViewMode {
  HOME = 'home',
  DASHBOARD = 'dashboard',
  SCHEDULE = 'schedule',
  INFO = 'info',
  DIRECTORY = 'directory'
}

export type CourseType = 'SCHOOL' | 'JUMPSTART' | 'EXPERIENCE' | 'PARTNERS';

export interface Course {
  id: CourseType;
  name: string;
  subtitle: string;
  sheetId: string;
  icon: string;
}
