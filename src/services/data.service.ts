import { Injectable, signal, effect } from '@angular/core';

export type MoodType = 'Feliz' | 'Calmado' | 'Neutro' | 'Triste' | 'Ansioso' | 'Enojado';

export interface JournalEntry {
  id: string;
  content: string;
  date: string; // ISO string
  mood: MoodType;
  moodValue: number; // 1-5 scale for charts
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  entries = signal<JournalEntry[]>([]);

  constructor() {
    // Load from local storage
    try {
      const saved = localStorage.getItem('calma_journal');
      if (saved) {
        this.entries.set(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading data', e);
    }

    // Save on change
    effect(() => {
      try {
        localStorage.setItem('calma_journal', JSON.stringify(this.entries()));
      } catch (e) {
        console.error('Error saving data', e);
      }
    });
  }

  addEntry(content: string, mood: MoodType) {
    const moodValues: Record<MoodType, number> = {
      'Feliz': 5,
      'Calmado': 4,
      'Neutro': 3,
      'Triste': 2,
      'Ansioso': 1,
      'Enojado': 1
    };

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content,
      date: new Date().toISOString(),
      mood,
      moodValue: moodValues[mood]
    };

    this.entries.update(list => [newEntry, ...list]);
  }

  deleteEntry(id: string) {
    this.entries.update(list => list.filter(e => e.id !== id));
  }

  getWeeklyStats() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Filter last 7 days
    const recent = this.entries().filter(e => new Date(e.date) >= oneWeekAgo);
    
    // Group by day (simplified)
    // We will just return the raw entries for the component to visualize
    return recent.reverse(); // Oldest first for chart
  }
}