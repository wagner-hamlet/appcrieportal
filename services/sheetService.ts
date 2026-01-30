
import { WorkshopEvent, CourseType } from "../types";

export const COURSES_CONFIG: Record<CourseType, string> = {
  SCHOOL: "1ypwNwtBfLt0keb253EX75lgkQ0G-uDJ49f-ranAVP-w",
  JUMPSTART: "1pC8-rO8qq2Q2pN-jo1QD0LE-yTg3nJXRez91POAOfTc",
  EXPERIENCE: "1ah7cbO6NBBjCOB8T37v3ey4NIUxJumfkzXESJyqQVic"
};

export class SheetService {
  static async fetchEvents(courseId: CourseType): Promise<WorkshopEvent[]> {
    const sheetId = COURSES_CONFIG[courseId];
    try {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0&t=${Date.now()}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error("Falha ao acessar planilha.");
      
      const csvText = await response.text();
      return this.parseCSV(csvText, courseId);
    } catch (error) {
      console.error("Erro ao sincronizar planilha:", error);
      throw error;
    }
  }

  private static parseCSV(csvText: string, courseId: CourseType): WorkshopEvent[] {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
    if (lines.length < 2) return [];

    const dataLines = lines.slice(1);
    
    return dataLines.map((line, index) => {
      const values: string[] = [];
      let currentField = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentField.trim());
          currentField = "";
        } else {
          currentField += char;
        }
      }
      values.push(currentField.trim());

      // Mapeamento das colunas: A=0, B=1, ..., L=11, M=12
      const [
        dateStr, 
        timeStr, 
        title, 
        professor, 
        location, 
        description, 
        typeStr, 
        facultyBody, 
        dailySummary, 
        coverTitle, 
        coverTitle2, 
        subtitle,
        subInicial
      ] = values;

      if (!dateStr || !timeStr || !title) return null;

      try {
        const dateParts = dateStr.replace(/-/g, '/').split('/').map(Number);
        const timeParts = timeStr.split(':').map(Number);
        const dateObj = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1]);
        
        if (isNaN(dateObj.getTime())) return null;

        return {
          id: `${courseId}-${index}-${dateObj.getTime()}`,
          title,
          time: timeStr,
          location: location || "Auditório CRIE",
          description: description || "",
          speaker: professor,
          type: typeStr || "Workshop",
          timestamp: dateObj.getTime(),
          facultyBody: facultyBody || "",
          dailySummary: dailySummary || "",
          coverTitle: coverTitle || "",
          coverTitle2: coverTitle2 || "",
          subtitle: subtitle || "",
          subInicial: subInicial || ""
        };
      } catch (e) { return null; }
    }).filter(event => event !== null) as WorkshopEvent[];
  }

  static saveToCache(courseId: CourseType, events: WorkshopEvent[]) {
    localStorage.setItem(`crie_events_cache_${courseId}`, JSON.stringify(events));
    localStorage.setItem(`crie_last_sync_${courseId}`, new Date().toISOString());
  }

  static getFromCache(courseId: CourseType): WorkshopEvent[] | null {
    const cached = localStorage.getItem(`crie_events_cache_${courseId}`);
    return cached ? JSON.parse(cached) : null;
  }

  static getLastSync(courseId: CourseType): string | null {
    return localStorage.getItem(`crie_last_sync_${courseId}`);
  }
}
