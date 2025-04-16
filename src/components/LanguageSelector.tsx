import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { HiCheck, HiChevronUpDown, HiGlobeAlt } from 'react-icons/hi2';
import { SUPPORTED_LANGUAGES } from '../lib/speech';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function LanguageSelector({ value, onChange, label }: LanguageSelectorProps) {
  return (
    <div className="w-full">
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </Listbox.Label>
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-3 pr-10 text-left border border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
            <div className="flex items-center">
              <HiGlobeAlt className="h-5 w-5 text-gray-400 mr-2" />
              <span className="block truncate">
                {SUPPORTED_LANGUAGES[value as keyof typeof SUPPORTED_LANGUAGES]}
              </span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <HiChevronUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                <Listbox.Option
                  key={code}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                    }`
                  }
                  value={code}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <HiCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
} 