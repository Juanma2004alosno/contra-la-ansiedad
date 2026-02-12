import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full bg-white/40 overflow-y-auto">
      
      <!-- SOS Section -->
      <div class="p-6 pb-2">
        <div class="bg-rose-500 text-white rounded-3xl p-6 shadow-xl shadow-rose-200 relative overflow-hidden">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h2 class="font-bold text-lg">Ayuda Inmediata</h2>
          </div>
          
          <div class="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/20">
            <p class="text-xs uppercase font-bold tracking-wider opacity-80 mb-1">Emergencias 24/7</p>
            <p class="text-4xl font-black tracking-tight">112</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 pt-2">
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 ml-1">Estrategias de Coping</h3>
        
        <div class="space-y-4">
          <!-- Strategy 1 -->
          <details class="group bg-white rounded-3xl shadow-sm border border-slate-50 overflow-hidden">
            <summary class="flex items-center justify-between p-5 cursor-pointer list-none">
              <span class="flex items-center gap-4">
                <span class="bg-blue-100 text-blue-600 w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm">1</span>
                <span class="font-bold text-slate-700">5-4-3-2-1</span>
              </span>
              <div class="bg-slate-50 w-8 h-8 rounded-full flex items-center justify-center group-open:bg-slate-800 group-open:text-white transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            <div class="px-5 pb-5 pt-0 text-slate-600 text-sm leading-relaxed">
              <div class="h-px w-full bg-slate-100 mb-4"></div>
              Identifica a tu alrededor:
              <ul class="mt-2 space-y-2 pl-2">
                <li class="flex gap-2"><span class="text-slate-400">👁️</span> 5 cosas que ves</li>
                <li class="flex gap-2"><span class="text-slate-400">✋</span> 4 cosas que tocas</li>
                <li class="flex gap-2"><span class="text-slate-400">👂</span> 3 cosas que oyes</li>
                <li class="flex gap-2"><span class="text-slate-400">👃</span> 2 cosas que hueles</li>
                <li class="flex gap-2"><span class="text-slate-400">👅</span> 1 cosa que saboreas</li>
              </ul>
            </div>
          </details>

          <!-- Strategy 2 -->
          <details class="group bg-white rounded-3xl shadow-sm border border-slate-50 overflow-hidden">
             <summary class="flex items-center justify-between p-5 cursor-pointer list-none">
              <span class="flex items-center gap-4">
                <span class="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm">2</span>
                <span class="font-bold text-slate-700">Shock Térmico</span>
              </span>
              <div class="bg-slate-50 w-8 h-8 rounded-full flex items-center justify-center group-open:bg-slate-800 group-open:text-white transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            <div class="px-5 pb-5 pt-0 text-slate-600 text-sm leading-relaxed">
               <div class="h-px w-full bg-slate-100 mb-4"></div>
              Usa agua muy fría en tu cara o manos. Esto activa el sistema parasimpático y reduce la frecuencia cardíaca instantáneamente.
            </div>
          </details>
        </div>
      </div>
    </div>
  `
})
export class ResourcesComponent {}