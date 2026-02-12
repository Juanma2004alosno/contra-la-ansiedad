import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

type Technique = {
  id: string;
  name: string;
  description: string;
  color: string; // Tailwind class prefix e.g., 'teal'
  pattern: number[]; 
};

@Component({
  selector: 'app-breathing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full bg-white/40 overflow-hidden">
      <!-- Selector -->
      <div class="pt-6 px-6">
        <h2 class="text-lg font-bold text-slate-800 mb-4 text-center">Elige tu ritmo</h2>
        <div class="flex justify-center gap-3">
          @for (tech of techniques; track tech.id) {
            <button 
              (click)="selectTechnique(tech)"
              [class]="'px-4 py-2 rounded-full text-xs font-bold transition-all border ' + 
              (currentTechnique().id === tech.id 
                ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300')"
            >
              {{ tech.name }}
            </button>
          }
        </div>
        <p class="text-center text-xs text-slate-400 mt-4">{{ currentTechnique().description }}</p>
      </div>

      <!-- Animation Area -->
      <div class="flex-1 flex flex-col items-center justify-center relative">
        
        <!-- Breathing Core -->
        <div class="relative flex items-center justify-center w-80 h-80 mb-12">
          
          <!-- Outer Aura (Exhale limit) -->
          <div class="absolute w-[280px] h-[280px] rounded-full border border-slate-200 opacity-30"></div>

          <!-- Animated Expanding Circle -->
          <div 
            class="absolute rounded-full transition-all ease-in-out mix-blend-multiply filter blur-xl"
            [style.width]="circleSize()"
            [style.height]="circleSize()"
            [style.opacity]="isActive() ? '0.4' : '0.1'"
            [style.background-color]="getHexColor()"
            [style.transition-duration]="duration() + 'ms'"
          ></div>

          <!-- Main Circle -->
          <div 
            class="absolute rounded-full transition-all ease-in-out shadow-2xl flex items-center justify-center z-10"
            [style.width]="innerCircleSize()"
            [style.height]="innerCircleSize()"
            [style.background-color]="getHexColor()"
            [style.opacity]="isActive() ? '0.9' : '0.5'"
            [style.transition-duration]="duration() + 'ms'"
          >
             <span class="text-white font-bold text-2xl tracking-widest uppercase opacity-90 transition-opacity">
                {{ instruction() }}
             </span>
          </div>
        </div>

        <button 
          (click)="toggleSession()"
          [class]="'w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all text-2xl ' + 
          (isActive() 
            ? 'bg-white text-slate-800 border-2 border-slate-100 hover:bg-slate-50' 
            : 'bg-slate-800 text-white hover:bg-slate-700 hover:scale-110')"
        >
          @if (isActive()) {
             <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          } @else {
             <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          }
        </button>
      </div>
    </div>
  `
})
export class BreathingComponent implements OnDestroy {
  
  techniques: Technique[] = [
    { 
      id: 'calm', 
      name: 'Relax (4-7-8)', 
      description: 'Dormir y calma profunda.', 
      color: 'teal', 
      pattern: [4000, 7000, 8000, 0] 
    },
    { 
      id: 'box', 
      name: 'Enfoque (Box)', 
      description: 'Control y claridad mental.', 
      color: 'blue', 
      pattern: [4000, 4000, 4000, 4000] 
    },
    { 
      id: 'balance', 
      name: 'Balance (5-5)', 
      description: 'Coherencia cardíaca rápida.', 
      color: 'rose', 
      pattern: [5000, 0, 5000, 0] 
    }
  ];

  currentTechnique = signal<Technique>(this.techniques[0]);
  isActive = signal(false);
  instruction = signal('Listo');
  
  circleSize = signal('120px');
  innerCircleSize = signal('120px');
  duration = signal(1000);

  private timeoutId: any;
  private isDestroyed = false;

  getHexColor(): string {
    const map: any = { 'teal': '#2dd4bf', 'blue': '#60a5fa', 'rose': '#fb7185' };
    return map[this.currentTechnique().color] || '#cbd5e1';
  }

  selectTechnique(tech: Technique) {
    this.stop();
    this.currentTechnique.set(tech);
  }

  toggleSession() {
    this.isActive() ? this.stop() : this.start();
  }

  start() {
    this.isActive.set(true);
    this.runPhase(0);
  }

  stop() {
    this.isActive.set(false);
    clearTimeout(this.timeoutId);
    this.instruction.set('Listo');
    this.resetCircle();
  }

  runPhase(phaseIndex: number) {
    if (!this.isActive() || this.isDestroyed) return;

    const pattern = this.currentTechnique().pattern;
    const currentDuration = pattern[phaseIndex];
    
    if (currentDuration === 0) {
      this.runPhase((phaseIndex + 1) % pattern.length);
      return;
    }

    this.duration.set(currentDuration);

    let action = '';
    
    switch(phaseIndex) {
      case 0: // Inhale
        action = 'Inhala';
        this.circleSize.set('280px');
        this.innerCircleSize.set('220px');
        break;
      case 1: // Hold
        action = 'Sostén';
        break;
      case 2: // Exhale
        action = 'Exhala';
        this.circleSize.set('120px');
        this.innerCircleSize.set('120px');
        break;
      case 3: // Hold
        action = 'Sostén';
        break;
    }

    this.instruction.set(action);

    this.timeoutId = setTimeout(() => {
      const nextPhase = (phaseIndex + 1) % pattern.length;
      this.runPhase(nextPhase);
    }, currentDuration);
  }

  resetCircle() {
    this.duration.set(1000);
    this.circleSize.set('120px');
    this.innerCircleSize.set('120px');
  }

  ngOnDestroy() {
    this.isDestroyed = true;
    this.stop();
  }
}