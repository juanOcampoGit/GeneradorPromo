
import React from 'react';
import type { AdConfig, AdTone, AdLength, TargetAudience } from '../types';
import { TONE_OPTIONS, LENGTH_OPTIONS, AUDIENCE_OPTIONS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';

interface AdGeneratorControlsProps {
  config: AdConfig;
  onConfigChange: (newConfig: AdConfig) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

const AdGeneratorControls: React.FC<AdGeneratorControlsProps> = ({ config, onConfigChange, onGenerate, isGenerating, disabled }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onConfigChange({ ...config, [name]: value });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onConfigChange({ ...config, [name]: value });
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-neutral-dark mb-4">Configurar Anuncio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="audience" className="block text-sm font-medium text-neutral-dark mb-1">Público Objetivo</label>
          <select
            id="audience"
            name="audience"
            value={config.audience}
            onChange={handleSelectChange}
            disabled={disabled}
            className="w-full p-2 border border-neutral rounded-md shadow-sm focus:ring-primary-light focus:border-primary-light"
          >
            {AUDIENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-neutral-dark mb-1">Tono</label>
          <select
            id="tone"
            name="tone"
            value={config.tone}
            onChange={handleSelectChange}
            disabled={disabled}
            className="w-full p-2 border border-neutral rounded-md shadow-sm focus:ring-primary-light focus:border-primary-light"
          >
            {TONE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
           <label htmlFor="length" className="block text-sm font-medium text-neutral-dark mb-1">Extensión</label>
          <select
            id="length"
            name="length"
            value={config.length}
            onChange={handleSelectChange}
            disabled={disabled}
            className="w-full p-2 border border-neutral rounded-md shadow-sm focus:ring-primary-light focus:border-primary-light"
          >
            {LENGTH_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className="mt-6 w-full bg-primary text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center
                   hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark
                   transition-all duration-300 ease-in-out transform hover:scale-105
                   disabled:bg-neutral disabled:cursor-not-allowed disabled:transform-none"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generando...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2" />
            Generar Anuncio
          </>
        )}
      </button>
    </div>
  );
};

export default AdGeneratorControls;
   