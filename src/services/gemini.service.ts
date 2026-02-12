import { Injectable } from '@angular/core';
import { GoogleGenAI, Chat } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY']! });
  }

  startChat() {
    this.chatSession = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `Eres "Calma", un psicólogo acompañante de IA (NO clínico, solo apoyo). 
        Tu tono es cálido, profesional, empático y calmado.
        
        Tus funciones:
        1. Escucha activa: Valida emociones.
        2. Psicoeducación: Explica brevemente por qué sentimos ansiedad/depresión si se pregunta.
        3. Técnicas: Sugiere ejercicios de respiración, grounding (5 sentidos), o escritura.
        4. Crisis: Si detectas riesgo suicida o autolesión, da este mensaje INMEDIATAMENTE: "Siento que estés pasando por tanto dolor. Por favor, llama al 112 (Emergencias) o a la Línea de la Vida, hay gente que quiere ayudarte ahora mismo." y no sigas la conversación normal.
        
        Sé breve. Usa listas cortas si das consejos.`
      }
    });
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chatSession) {
      this.startChat();
    }
    try {
      const result = await this.chatSession!.sendMessage({ message });
      return result.text;
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      // Fallback simple response in case of error
      return 'Lo siento, mi conexión es débil ahora. Pero estoy aquí contigo. ¿Podemos intentar respirar juntos unos segundos?';
    }
  }

  async getDailyAffirmation(): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Genera una frase de afirmación psicológica muy corta (max 15 palabras) para la ansiedad o depresión. Tono: Esperanza, fortaleza, validación. Solo el texto.',
      });
      return response.text.trim();
    } catch (error) {
      return "Tu paz interior es posible, un respiro a la vez.";
    }
  }
}