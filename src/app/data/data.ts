import { Injectable } from '@angular/core';
import { Meetings } from "../calendar/meetings.interface";

@Injectable({
  providedIn: 'root'
})
export class Data {
  defaultMeetings: Meetings = {
    '2025-06-29': ['Team Meeting at 10:00 AM', 'Project Review at 2:00 PM'],
    '2025-06-30': ['Client Call at 9:00 AM'],
    '2025-07-07': ['Client Presentation at 11:00 AM'],
    '2025-07-08': ['Team Standup at 9:00 AM'],
    '2025-07-09': ['Feature Demo at 2:00 PM'],
    '2025-07-10': ['Project Retrospective at 4:00 PM'],
    '2025-07-11': ['Client Feedback Session at 2:00 PM'],
    '2025-07-12': ['Workshop on Best Practices at 4:00 PM'],
    '2025-07-14': ['Project Update at 3:00 PM'],
    '2025-07-15': ['Quarterly Review'],
    '2025-07-16': ['Budget Meeting at 3:00 PM'],
    '2025-07-17': ['Design Review at 1:00 PM'],
    '2025-07-18': ['Sprint Planning at 11:00 AM','Sprint Planning at 9:00 AM'],
    '2025-08-01': ['Budget Planning Session'],
    '2025-08-15': ['Project Kickoff Meeting'],
    '2025-08-16': ['Team Building Activity at 2:00 PM'],
    '2025-08-17': ['Project Planning Session at 10:00 AM'],
    '2025-08-18': ['Team Retrospective at 10:00 AM'],
    '2025-08-19': ['Team Retrospective at 10:00 AM']
  };

  holiday: Record<string, string[]> = {
    '01-01': ['New Year’s Day'],
    '04-09': ['Araw ng Kagitingan'],
    '04-17': ['Maundy Thursday'],
    '04-18': ['Good Friday'],
    '05-01': ['Labor Day'],
    '06-12': ['Independence Day'],
    '11-30': ['Bonifacio Day'],
    '12-25': ['Christmas Day'],
    '12-30': ['Rizal Day'],
    '08-21': ['Ninoy Aquino Day'],
    '11-01': ['All Saints’ Day'],
    '12-08': ['Feast of the Immaculate Conception of Mary'],
    '12-31': ['Last Day of the Year'],
    '01-29': ['Chinese New Year'],
    '04-19': ['Black Saturday'],
    '12-24': ['Christmas Eve'],
    '02-25': ['EDSA People Power Revolution Anniversary'],
  };


  completedTasks: Record<string, string> = {};

  constructor() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const completed = localStorage.getItem('completedTasks');
      if (completed) {
        try {
          this.completedTasks = JSON.parse(completed);
        } catch (e) {
          console.warn('Failed to parse completedTasks from localStorage', e);
          this.completedTasks = {};
        }
      }
    }
  }

  private makeKey(date: string, text: string): string {
    return `${date}::${text}`;
  }

  private saveCompletedTasks() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));
    }
  }

  isCompleted(date: string, text: string): boolean {
    const key = this.makeKey(date, text);
    return this.completedTasks.hasOwnProperty(key);
  }

  markTaskAsDone(date: string, text: string) {
    const key = this.makeKey(date, text);
    if (!this.isCompleted(date, text)) {
      this.completedTasks[key] = new Date().toISOString();
      this.saveCompletedTasks();
    }
  }

  unmarkTaskAsDone(date: string, text: string) {
    const key = this.makeKey(date, text);
    delete this.completedTasks[key];
    this.saveCompletedTasks();
  }

  getDoneDate(date: string, text: string): string | null {
    const key = this.makeKey(date, text);
    const isoDate = this.completedTasks[key];
    if (!isoDate) return null;

    const parsed = new Date(isoDate);
    return isNaN(parsed.getTime()) ? null : parsed.toLocaleDateString();
  }

  getCleanMeetings(): Meetings {
    const cleaned: Meetings = {};
    for (const date in this.defaultMeetings) {
      const filtered = this.defaultMeetings[date].filter(
        (text) => !this.isCompleted(date, text));
      if (filtered.length > 0) {
        cleaned[date] = filtered;
      }
    }
    return cleaned;
  }

  getTodayTasks(): string[] {
    const today = new Date().toISOString().slice(0, 10);
    const cleanMeetings = this.getCleanMeetings();
    return cleanMeetings[today] || [];
  }

}
