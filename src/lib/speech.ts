import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from './types';

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;

  constructor(language: string) {
    console.log('Initializing SpeechRecognitionService with language:', language);
    if (typeof window !== 'undefined') {
      if ('webkitSpeechRecognition' in window) {
        console.log('WebkitSpeechRecognition is supported');
        this.recognition = new (window as any).webkitSpeechRecognition();
        this.setupRecognition(language);
      } else {
        console.warn('WebkitSpeechRecognition is not supported in this browser');
      }
    }
  }

  private setupRecognition(language: string) {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = language;

    // Add additional event handlers for better debugging
    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.isListening = true;
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      this.isListening = false;
    };

    this.recognition.onaudiostart = () => {
      console.log('Audio capturing started');
    };

    this.recognition.onaudioend = () => {
      console.log('Audio capturing ended');
    };

    this.recognition.onsoundstart = () => {
      console.log('Sound detected');
    };

    this.recognition.onsoundend = () => {
      console.log('Sound ended');
    };

    this.recognition.onspeechstart = () => {
      console.log('Speech detected');
    };

    this.recognition.onspeechend = () => {
      console.log('Speech ended');
    };

    this.recognition.onnomatch = () => {
      console.log('No speech was recognized');
    };
  }

  public start(onResult: (result: SpeechRecognitionResult) => void, onError: (error: Error) => void) {
    console.log('Starting speech recognition...');
    
    if (!this.recognition) {
      const error = new Error('Speech recognition not supported in this browser');
      console.error(error);
      onError(error);
      return;
    }

    if (this.isListening) {
      console.log('Already listening, stopping current session...');
      this.stop();
    }

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('Speech recognition result received:', event);
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      console.log('Transcript:', transcript, 'Final:', result.isFinal);
      
      onResult({
        transcript: transcript,
        isFinal: result.isFinal
      });
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      onError(new Error(`Speech recognition error: ${event.error}`));
      this.isListening = false;
    };

    try {
      this.recognition.start();
      console.log('Speech recognition started successfully');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      onError(new Error('Failed to start speech recognition'));
      this.isListening = false;
    }
  }

  public stop() {
    console.log('Stopping speech recognition...');
    if (!this.recognition || !this.isListening) {
      console.log('Speech recognition is not active');
      return;
    }

    try {
      this.recognition.stop();
      console.log('Speech recognition stopped successfully');
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
    this.isListening = false;
  }

  public setLanguage(language: string) {
    console.log('Setting speech recognition language to:', language);
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }
}

export class SpeechSynthesisService {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  public speak(text: string, language: string) {
    console.log('Speaking text in language:', language);
    if (this.utterance) {
      this.synthesis.cancel();
    }

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = language;
    this.utterance.rate = 1;
    this.utterance.pitch = 1;

    this.synthesis.speak(this.utterance);
  }

  public stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

// Language codes and names mapping
export const SUPPORTED_LANGUAGES = {
  'en-US': 'English',
  'es-ES': 'Spanish',
  'fr-FR': 'French',
  'de-DE': 'German',
  'it-IT': 'Italian',
  'pt-PT': 'Portuguese',
  'zh-CN': 'Chinese (Simplified)',
  'ja-JP': 'Japanese',
  'ko-KR': 'Korean',
  'hi-IN': 'Hindi',
  'ar-SA': 'Arabic'
}; 