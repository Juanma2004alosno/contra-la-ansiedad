import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full bg-white/40 p-6 overflow-y-auto">
      <h2 class="text-xl font-bold text-slate-800 mb-6">Tu Balance Emocional</h2>

      @if (chartData().length === 0) {
        <div class="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-slate-50">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p class="text-slate-600 font-medium">Sin datos suficientes</p>
          <p class="text-xs text-slate-400 mt-1">Usa el diario para generar tu gráfica.</p>
        </div>
      } @else {
        <!-- Chart Container -->
        <div class="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-50 mb-6">
          <div class="flex items-end justify-between h-40 w-full gap-2">
            @for (item of chartData(); track $index) {
              <div class="flex flex-col items-center justify-end h-full w-full group relative">
                <!-- Bar -->
                <div 
                  class="w-full max-w-[12px] sm:max-w-[20px] rounded-full transition-all duration-1000 ease-out relative"
                  [style.height]="(item.value / 5 * 100) + '%'"
                  [class]="getColorClass(item.value)"
                >
                  <!-- Tooltip inside visual logic if needed, or simple title -->
                </div>
                
                <!-- Day Label -->
                <span class="text-[9px] font-bold text-slate-400 mt-3 uppercase tracking-wider">
                  {{ item.date | date:'dd' }}
                </span>
              </div>
            }
          </div>
        </div>

        <!-- Insights -->
        <div class="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-6 border border-indigo-50">
          <h3 class="font-bold text-indigo-900 text-sm uppercase tracking-wider mb-3">Resumen Semanal</h3>
          <p class="text-indigo-800/80 text-sm leading-relaxed">
            @if (averageMood() >= 4) {
              🌟 <strong>Excelente semana.</strong> Tu estado de ánimo es predominantemente positivo. Sigue cultivando esa paz.
            } @else if (averageMood() >= 3) {
              🌱 <strong>Estable.</strong> Mantienes un equilibrio saludable. La consistencia es clave para el bienestar.
            } @else {
              ❤️ <strong>Días difíciles.</strong> Es normal tener altibajos. Usa las herramientas de respiración y chat para apoyarte.
            }
          </p>
        </div>
      }
    </div>
  `
})
export class ProgressComponent {
  dataService = inject(DataService);

  chartData = computed(() => {
    const raw = this.dataService.getWeeklyStats();
    return raw.slice(-7).map(e => ({
      date: e.date,
      value: e.moodValue,
      mood: e.mood
    }));
  });

  averageMood = computed(() => {
    const data = this.chartData();
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr.value, 0);
    return sum / data.length;
  });

  getColorClass(value: number): string {
    if (value >= 4) return 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]'; 
    if (value === 3) return 'bg-indigo-300 shadow-[0_0_15px_rgba(165,180,252,0.4)]';
    return 'bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.4)]';
  }
}