
import React, { useState, useEffect } from 'react';

interface GeneratedAdDisplayProps {
  adText: string;
}

const GeneratedAdDisplay: React.FC<GeneratedAdDisplayProps> = ({ adText }) => {
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const handleCopy = () => {
    navigator.clipboard.writeText(adText).then(() => {
      setCopySuccess('¡Copiado!');
    }, () => {
      setCopySuccess('Error al copiar');
    });
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-neutral-dark">Anuncio Generado</h2>
        <button
          onClick={handleCopy}
          className="bg-neutral-light text-neutral-dark px-3 py-1 rounded-md text-sm font-medium hover:bg-neutral transition-colors disabled:opacity-50"
          disabled={!adText}
        >
          {copySuccess || 'Copiar'}
        </button>
      </div>
      <div className="bg-neutral-light p-4 rounded-md min-h-[150px] whitespace-pre-wrap text-neutral-dark">
        {adText || 'El texto de tu anuncio aparecerá aquí...'}
      </div>
    </div>
  );
};

export default GeneratedAdDisplay;
   