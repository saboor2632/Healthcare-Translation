'use client';

import React, { useState } from 'react';
import LanguageSelector from '../components/LanguageSelector';
import TranslationBox from '../components/TranslationBox';
import { HiOutlineGlobeAlt, HiOutlineShieldCheck, HiOutlineArrowDown } from 'react-icons/hi2';

export default function Home() {
  const [sourceLang, setSourceLang] = useState('en-US');
  const [targetLang, setTargetLang] = useState('fr-FR');
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslation = (text: string) => {
    setTranslatedText(text);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Banner */}
        <div className="bg-blue-50 rounded-full px-6 py-2 flex items-center justify-center mb-10 max-w-md mx-auto">
          <HiOutlineGlobeAlt className="w-5 h-5 text-blue-600 mr-2" />
          <span className="text-blue-800">Breaking language barriers in healthcare</span>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 text-transparent bg-clip-text inline-block">
              Healthcare Translation
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time medical translation powered by AI for accurate, reliable 
            communication between healthcare providers and patients.
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
            50+ languages supported
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm">
            HIPAA compliant
          </div>
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
            Real-time translation
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm">
            Medical accuracy verification
          </div>
        </div>

        {/* Source Language Section */}
        <div className="mb-2">
          <div className="flex items-center mb-4">
            <div className="text-xl font-medium text-gray-700 mr-auto">Source Language</div>
            <div className="w-64">
              <LanguageSelector
                value={sourceLang}
                onChange={setSourceLang}
                label=""
              />
            </div>
          </div>
          <TranslationBox
            sourceLang={sourceLang}
            targetLang={targetLang}
            isSource={true}
            onTranslation={handleTranslation}
          />
        </div>

        {/* Arrow Divider */}
        <div className="flex justify-center my-6">
          <div className="bg-gray-100 rounded-full p-4">
            <HiOutlineArrowDown className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        {/* Target Language Section */}
        <div>
          <div className="flex items-center mb-4">
            <div className="text-xl font-medium text-gray-700 mr-auto">Target Language</div>
            <div className="w-64">
              <LanguageSelector
                value={targetLang}
                onChange={setTargetLang}
                label=""
              />
            </div>
          </div>
          <TranslationBox
            sourceLang={sourceLang}
            targetLang={targetLang}
            isSource={false}
            text={translatedText}
          />
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-start justify-center text-gray-600">
          <HiOutlineShieldCheck className="w-5 h-5 mt-0.5 mr-2 text-gray-500" />
          <p className="text-sm text-gray-500 max-w-2xl">
            This application is designed for healthcare communication. Please verify all translations for critical medical information.
          </p>
        </div>
      </div>
    </main>
  );
} 