import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreathingComponent } from './components/breathing.component';
import { ChatComponent } from './components/chat.component';
import { JournalComponent } from './components/journal.component';
import { ResourcesComponent } from './components/resources.component';
import { ProgressComponent } from './components/progress.component';
import { GeminiService } from './services/gemini.service';

type View = 'dashboard' | 'chat' | 'breathing' | 'journal' | 'resources' | 'progress';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BreathingComponent, ChatComponent, JournalComponent, ResourcesComponent, ProgressComponent],
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  currentView = signal<View>('dashboard');
  dailyAffirmation = signal<string>('Conectando contigo...');
  geminiService = inject(GeminiService);

  async ngOnInit() {
    const affirmation = await this.geminiService.getDailyAffirmation();
    this.dailyAffirmation.set(affirmation);
  }

  setView(view: View) {
    this.currentView.set(view);
  }
}