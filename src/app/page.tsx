'use client';

import React, { useState } from 'react';
import LanguageSelector from '../components/LanguageSelector';
import TranslationBox from '../components/TranslationBox';
import { HiOutlineGlobeAlt, HiOutlineShieldCheck } from 'react-icons/hi2';

export default function Home() {
  const [sourceLang, setSourceLang] = useState('en-US');
  const [targetLang, setTargetLang] = useState('fr-FR');
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslation = (text: string) => {
    setTranslatedText(text);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HiOutlineGlobeAlt className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Healthcare Translation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time medical translation powered by AI, ensuring accurate healthcare communication across languages.
          </p>
        </div>

        {/* Main Translation Interface */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Source Language Section */}
          <div className="space-y-4 p-6 bg-white rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <LanguageSelector
                value={sourceLang}
                onChange={setSourceLang}
                label="Source Language"
              />
            </div>
            <TranslationBox
              sourceLang={sourceLang}
              targetLang={targetLang}
              isSource={true}
              onTranslation={handleTranslation}
            />
          </div>

          {/* Target Language Section */}
          <div className="space-y-4 p-6 bg-white rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <LanguageSelector
                value={targetLang}
                onChange={setTargetLang}
                label="Target Language"
              />
            </div>
            <TranslationBox
              sourceLang={sourceLang}
              targetLang={targetLang}
              isSource={false}
              text={translatedText}
            />
          </div>
        </div>

        {/* Footer Section */}
        <footer className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HiOutlineShieldCheck className="w-6 h-6 text-green-600" />
            <span className="text-gray-600">HIPAA Compliant</span>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            This application is designed for healthcare communication. Please verify all translations for critical medical information.
          </p>
        </footer>
      </div>
    </main>
  );
} 