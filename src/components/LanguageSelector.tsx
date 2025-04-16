import React from 'react';
import { Listbox } from '@headlessui/react';
import { HiCheck, HiChevronDown } from 'react-icons/hi2';
import { SUPPORTED_LANGUAGES } from '../lib/speech';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function LanguageSelector({ value, onChange, label }: LanguageSelectorProps) {
  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <span className="block truncate font-medium">
              {SUPPORTED_LANGUAGES[value as keyof typeof SUPPORTED_LANGUAGES]}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <HiChevronDown 
                className="h-5 w-5 text-gray-400 transition-transform duration-200" 
                aria-hidden="true" 
              />
            </span>
          </Listbox.Button>
          
          <Listbox.Options className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-lg py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
              Languages
            </div>
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <Listbox.Option
                key={code}
                value={code}
                className={({ active, selected }) =>
                  `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                    selected ? 'bg-blue-50 text-blue-700' : 
                    active ? 'bg-gray-50 text-gray-900' : 'text-gray-900'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {name}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                        <HiCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
} 