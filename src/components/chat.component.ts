import { Component, signal, ElementRef, ViewChild, AfterViewChecked, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../services/gemini.service';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full bg-white/40">
      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-5 space-y-6" #scrollContainer>
        @for (msg of messages(); track msg.timestamp) {
          <div [class]="'flex flex-col ' + (msg.sender === 'user' ? 'items-end' : 'items-start')">
            
            <div 
              [class]="'max-w-[85%] px-5 py-3 text-[15px] leading-relaxed shadow-sm relative ' + 
              (msg.sender === 'user' 
                ? 'bg-slate-800 text-white rounded-2xl rounded-tr-sm' 
                : 'bg-white text-slate-600 border border-slate-100 rounded-2xl rounded-tl-sm')"
            >
              <p class="whitespace-pre-wrap">{{ msg.text }}</p>
            </div>
            
            <span class="text-[10px] text-slate-400 mt-1 px-1">
              {{ msg.timestamp | date:'shortTime' }}
            </span>
          </div>
        }
        
        @if (isLoading()) {
          <div class="flex items-start">
             <div class="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1.5 items-center">
              <span class="text-xs text-slate-400 font-medium mr-2">Escribiendo</span>
              <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
              <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        }
      </div>

      <!-- Input Area -->
      <div class="p-4 pb-6 bg-white/80 backdrop-blur-md border-t border-white/50">
        <div class="flex gap-3 items-end">
          <div class="flex-1 relative">
            <textarea 
              [(ngModel)]="currentMessage" 
              (keydown.enter.prevent)="sendMessage()"
              placeholder="Cuéntame, ¿cómo te sientes?" 
              class="w-full bg-slate-100/50 border border-slate-200 rounded-[1.5rem] px-5 py-3.5 text-slate-700 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 focus:outline-none placeholder-slate-400 transition-all resize-none shadow-inner h-[52px] max-h-[120px]"
              [disabled]="isLoading()"
              rows="1"
            ></textarea>
          </div>
          
          <button 
            (click)="sendMessage()" 
            [disabled]="!currentMessage.trim() || isLoading()"
            class="w-[52px] h-[52px] flex items-center justify-center bg-slate-800 text-white rounded-full hover:bg-slate-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ChatComponent implements AfterViewChecked, OnInit {
  private geminiService = inject(GeminiService);
  
  messages = signal<Message[]>([]);
  currentMessage = '';
  isLoading = signal(false);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  ngOnInit() {
    this.addMessage({
      text: "Hola. Soy Calma, tu espacio seguro. ¿Cómo te sientes hoy? Estoy aquí para escucharte sin juzgar.",
      sender: 'ai',
      timestamp: new Date()
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  async sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading()) return;

    const userText = this.currentMessage;
    this.currentMessage = '';
    
    this.addMessage({
      text: userText,
      sender: 'user',
      timestamp: new Date()
    });

    this.isLoading.set(true);
    const response = await this.geminiService.sendMessage(userText);
    
    this.addMessage({
      text: response,
      sender: 'ai',
      timestamp: new Date()
    });

    this.isLoading.set(false);
  }

  addMessage(msg: Message) {
    this.messages.update(msgs => [...msgs, msg]);
  }
}