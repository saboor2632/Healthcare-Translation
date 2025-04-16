import React, { useState, useEffect, useCallback } from 'react';
import { HiMicrophone, HiSpeakerWave, HiStop, HiArrowPath } from 'react-icons/hi2';
import { SpeechRecognitionService, SpeechSynthesisService } from '../lib/speech';

interface TranslationBoxProps {
  sourceLang: string;
  targetLang: string;
  isSource: boolean;
  onTranslation?: (text: string) => void;
  text?: string;
}

export default function TranslationBox({ 
  sourceLang, 
  targetLang, 
  isSource, 
  onTranslation,
  text: externalText 
}: TranslationBoxProps) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionService | null>(null);
  const [synthesis] = useState(() => typeof window !== 'undefined' ? new SpeechSynthesisService() : null);

  // Update text when external text changes (for target box)
  useEffect(() => {
    if (!isSource && externalText !== undefined) {
      setText(externalText);
    }
  }, [isSource, externalText]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRecognition(new SpeechRecognitionService(sourceLang));
    }
  }, [sourceLang]);

  const handleTranslation = useCallback(async (textToTranslate: string) => {
    console.log('Starting translation...', { textToTranslate, sourceLang, targetLang, isSource });
    
    if (!textToTranslate.trim() || !isSource) {
      console.log('Translation skipped:', { reason: !textToTranslate.trim() ? 'empty text' : 'not source box' });
      return;
    }
    
    try {
      setIsTranslating(true);
      
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToTranslate,
          sourceLang,
          targetLang
        })
      });

      if (!response.ok) {
        throw new Error('Translation request failed');
      }

      const data = await response.json();
      
      if (onTranslation) {
        onTranslation(data.translatedText);
      }
    } catch (error) {
      console.error('Translation error:', error);
      if (onTranslation) {
        onTranslation('Error: Failed to translate text. Please try again.');
      }
    } finally {
      setIsTranslating(false);
    }
  }, [sourceLang, targetLang, isSource, onTranslation]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isSource) {
      setText(e.target.value);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && isSource) {
      e.preventDefault();
      await handleTranslation(text);
    }
  };

  const handleStartListening = useCallback(() => {
    if (!recognition) return;

    setIsListening(true);
    recognition.start(
      async (result) => {
        setText(result.transcript);
        if (result.isFinal) {
          setIsListening(false);
          await handleTranslation(result.transcript);
        }
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
      }
    );
  }, [recognition, handleTranslation]);

  const handleStopListening = useCallback(() => {
    if (!recognition) return;
    recognition.stop();
    setIsListening(false);
  }, [recognition]);

  const handleSpeak = useCallback(() => {
    if (!synthesis || !text) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isSource ? sourceLang : targetLang;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  }, [synthesis, text, isSource, sourceLang, targetLang]);

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          className={`w-full h-40 p-6 border rounded-lg resize-none transition-all duration-200 text-lg ${
            isSource 
              ? 'border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white'
              : !text.trim() ? 'border-gray-200 bg-white' : 'border-transparent bg-white'
          }`}
          placeholder={isSource ? "Type or speak your message here..." : "Translation will appear here..."}
          readOnly={!isSource}
        />
        
        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {isSource && (
            <button
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`p-3 rounded-full transition-all duration-200 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white shadow-sm`}
              title={isListening ? "Stop recording" : "Start recording"}
              aria-label={isListening ? "Stop recording" : "Start recording"}
            >
              {isListening ? (
                <HiStop className="w-5 h-5" />
              ) : (
                <HiMicrophone className="w-5 h-5" />
              )}
            </button>
          )}
          {text && (
            <button
              onClick={handleSpeak}
              className={`p-3 rounded-full transition-all duration-200 ${
                isSpeaking
                  ? 'bg-blue-500 hover:bg-blue-600 animate-pulse'
                  : 'bg-gray-500 hover:bg-gray-600'
              } text-white shadow-sm`}
              title="Play audio"
              aria-label="Play audio"
            >
              {isSpeaking ? (
                <HiArrowPath className="w-5 h-5 animate-spin" />
              ) : (
                <HiSpeakerWave className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        
        {/* Loading overlay */}
        {isTranslating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <HiArrowPath className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="text-gray-600 font-medium">Translating...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 