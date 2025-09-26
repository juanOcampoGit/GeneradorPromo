import React, { useState, useCallback, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageEditorCard from './components/ImageEditorCard';
import AdGeneratorControls from './components/AdGeneratorControls';
import GeneratedAdDisplay from './components/GeneratedAdDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';
import * as geminiService from './services/geminiService';
import * as pdfService from './services/pdfService';
import type { ImageFile, AdConfig } from './types';
import { EditOption, AdTone, AdLength } from './types';
import { DocumentArrowDownIcon } from './components/icons/DocumentArrowDownIcon';

const MainApp: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [adConfig, setAdConfig] = useState<AdConfig>({
    tone: AdTone.WARM,
    length: AdLength.STANDARD,
    audience: 'Familias',
  });
  const [generatedAd, setGeneratedAd] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isCreatingPdf, setIsCreatingPdf] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImagesUploaded = async (files: FileList) => {
    setGlobalError(null);
    const newImages: ImageFile[] = await Promise.all(
      Array.from(files).map(async (file) => {
        const base64 = await fileToBase64(file);
        return {
          id: `${file.name}-${Date.now()}`,
          file,
          base64,
          originalBase64: base64,
          editedStates: {},
          editOption: EditOption.KEEP,
          isLoading: false,
          error: null,
        };
      })
    );
    setImages(prev => [...prev, ...newImages]);
  };

  const handleOptionChange = async (id: string, option: EditOption) => {
    const imageToUpdate = images.find(img => img.id === id);
    if (!imageToUpdate) return;

    setImages(prev => prev.map(img => img.id === id ? { ...img, editOption: option, error: null } : img));

    if (option === EditOption.KEEP) {
        setImages(prev => prev.map(img => img.id === id ? { ...img, base64: img.originalBase64 } : img));
        return;
    }
    
    if (imageToUpdate.editedStates[option]) {
         setImages(prev => prev.map(img => img.id === id ? { ...img, base64: imageToUpdate.editedStates[option]! } : img));
        return;
    }
    
    setImages(prev => prev.map(img => img.id === id ? { ...img, isLoading: true } : img));
    try {
        const editedData = await geminiService.editImage(imageToUpdate.originalBase64.split(',')[1], imageToUpdate.file.type, option);
        const editedFullBase64 = `data:${imageToUpdate.file.type};base64,${editedData}`;

        setImages(prev => prev.map(img => img.id === id ? { ...img, isLoading: false, base64: editedFullBase64, editedStates: { ...img.editedStates, [option]: editedFullBase64 } } : img));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setImages(prev => prev.map(img => img.id === id ? { ...img, isLoading: false, error: errorMessage, editOption: EditOption.KEEP } : img));
    }
  };


  const handleDeleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };
  
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGlobalError(null);
    setGeneratedAd('');

    if (images.some(img => !!img.error)) {
        setGlobalError("Por favor, soluciona los errores en las imágenes antes de generar el anuncio.");
        setIsGenerating(false);
        return;
    }

    try {
        const adText = await geminiService.generateAdText(images, adConfig);
        setGeneratedAd(adText);
    } catch (error) {
        setGlobalError(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
        setIsGenerating(false);
    }
  }, [images, adConfig]);

  const handleCreatePdf = async () => {
    if (!generatedAd) return;
    setIsCreatingPdf(true);
    setGlobalError(null);
    try {
      await pdfService.generatePdf(generatedAd, images);
    } catch (error) {
      setGlobalError("No se pudo generar el PDF. Por favor, inténtalo de nuevo.");
      console.error("PDF Generation Error:", error);
    } finally {
      setIsCreatingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light font-sans text-neutral-dark">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <SparklesIcon className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold text-primary-dark">Generador de Anuncios Inmobiliarios AI</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-2">Paso 1: Sube las Imágenes</h2>
            <p className="text-sm text-neutral-dark/80 mb-4">Añade una o más fotos de la propiedad. La IA las analizará para crear el anuncio.</p>
            <ImageUploader onImagesUploaded={handleImagesUploaded} disabled={isGenerating || images.some(i => i.isLoading)}/>
        </div>
        
        {images.length > 0 && (
          <>
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Paso 2: Edita tus Imágenes (Opcional)</h2>
                <p className="text-sm text-neutral-dark/80 mb-4">Para cada imagen, puedes elegir mantenerla, amueblarla virtualmente o vaciar el espacio. ¡Compara el resultado al instante!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {images.map(image => (
                    <ImageEditorCard 
                        key={image.id} 
                        image={image} 
                        onOptionChange={handleOptionChange} 
                        onDelete={handleDeleteImage}
                    />
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Paso 3: Genera el Anuncio</h2>
                <p className="text-sm text-neutral-dark/80 mb-4">Ajusta los parámetros para que el texto se adapte a tu público y haz clic en generar.</p>
                <AdGeneratorControls 
                config={adConfig}
                onConfigChange={setAdConfig}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                disabled={images.length === 0 || images.some(i => i.isLoading)}
                />
            </div>
          </>
        )}
        
        {globalError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{globalError}</div>}

        {(generatedAd || isGenerating) && <GeneratedAdDisplay adText={generatedAd} />}

        {generatedAd && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleCreatePdf}
              disabled={isCreatingPdf}
              className="bg-accent text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center
                        hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent
                        transition-all duration-300 ease-in-out transform hover:scale-105
                        disabled:bg-neutral disabled:cursor-not-allowed disabled:transform-none"
            >
              {isCreatingPdf ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando PDF...
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                  Crear PDF del Anuncio
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  // FIX: Per guidelines, assume API key is configured and render the main app directly.
  return <MainApp />;
};

export default App;
