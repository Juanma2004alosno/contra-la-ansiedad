import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, MoodType } from '../services/data.service';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full bg-white/40">
      <!-- Tabs -->
      <div class="px-6 pt-6 pb-2">
        <div class="flex bg-slate-200/50 p-1 rounded-2xl">
          <button 
            (click)="activeTab = 'write'" 
            [class]="'flex-1 py-2 text-sm font-bold rounded-xl transition-all ' + (activeTab === 'write' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')"
          >
            Nueva Entrada
          </button>
          <button 
            (click)="activeTab = 'history'" 
            [class]="'flex-1 py-2 text-sm font-bold rounded-xl transition-all ' + (activeTab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')"
          >
            Memorias
          </button>
        </div>
      </div>

      <!-- WRITE MODE -->
      @if (activeTab === 'write') {
        <div class="flex-1 flex flex-col overflow-y-auto px-6 pb-6">
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 flex-1 flex flex-col">
            <h2 class="text-lg font-bold text-slate-800 mb-4">¿Cómo te sientes ahora?</h2>
            
            <div class="flex justify-between mb-6 px-1">
              @for (m of moods; track m.label) {
                <button 
                  (click)="selectedMood.set(m.label)"
                  [class]="'flex flex-col items-center transition-all p-2 rounded-2xl ' + 
                  (selectedMood() === m.label 
                    ? 'bg-slate-100 scale-110 ring-1 ring-slate-200' 
                    : 'opacity-60 hover:opacity-100')"
                >
                  <span class="text-3xl mb-1 filter drop-shadow-sm">{{ m.emoji }}</span>
                </button>
              }
            </div>

            <textarea 
              [(ngModel)]="newEntryContent"
              class="flex-1 w-full p-0 bg-transparent border-0 focus:ring-0 resize-none text-slate-600 placeholder-slate-300 text-lg leading-relaxed font-medium"
              style="background-image: linear-gradient(transparent, transparent 31px, #f1f5f9 31px); background-size: 100% 32px; line-height: 32px;"
              placeholder="Querido diario..."
            ></textarea>

            <button 
              (click)="saveEntry()"
              [disabled]="!newEntryContent.trim()"
              class="w-full mt-4 bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
            >
              Guardar Pensamiento
            </button>
          </div>
        </div>
      }

      <!-- HISTORY MODE -->
      @if (activeTab === 'history') {
        <div class="flex-1 overflow-y-auto space-y-4 px-6 pb-6 pt-2">
          @if (dataService.entries().length === 0) {
            <div class="h-full flex flex-col items-center justify-center text-center opacity-40">
              <span class="text-6xl mb-4 grayscale">📭</span>
              <p class="text-slate-500 font-medium">Tu diario espera tu primera historia.</p>
            </div>
          }
          
          @for (entry of dataService.entries(); track entry.id) {
            <div class="bg-white rounded-3xl p-5 border border-slate-50 shadow-sm relative group">
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl">
                    {{ getMoodEmoji(entry.mood) }}
                  </div>
                  <div>
                    <span class="block text-xs font-bold text-slate-800">{{ entry.mood }}</span>
                    <span class="block text-[10px] text-slate-400 uppercase tracking-wide">{{ entry.date | date:'MMM d • h:mm a' }}</span>
                  </div>
                </div>
                <button 
                  (click)="dataService.deleteEntry(entry.id)"
                  class="text-slate-300 hover:text-red-400 transition-colors p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p class="text-slate-600 text-sm leading-relaxed pl-1">{{ entry.content }}</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class JournalComponent {
  dataService = inject(DataService);
  
  activeTab: 'write' | 'history' = 'write';
  newEntryContent = '';
  selectedMood = signal<MoodType>('Calmado');

  moods: {label: MoodType, emoji: string}[] = [
    { label: 'Feliz', emoji: '😊' },
    { label: 'Calmado', emoji: '😌' },
    { label: 'Neutro', emoji: '😐' },
    { label: 'Triste', emoji: '😔' },
    { label: 'Ansioso', emoji: '😰' }
  ];

  saveEntry() {
    if (!this.newEntryContent.trim()) return;
    this.dataService.addEntry(this.newEntryContent, this.selectedMood());
    this.newEntryContent = '';
    this.selectedMood.set('Calmado');
    this.activeTab = 'history';
  }

  getMoodEmoji(label: string): string {
    return this.moods.find(m => m.label === label)?.emoji || '😐';
  }
}