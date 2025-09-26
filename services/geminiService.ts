import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { AdConfig, ImageFile, EditOption } from '../types';

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  // CORRECTO: Buscar la clave de la API en el objeto `window` que definimos en `env.js`.
  const apiKey = (window as any).process?.env?.API_KEY;
  
  if (!apiKey) {
    throw new Error("La clave de la API no se ha configurado. Asegúrate de que el archivo 'env.js' existe y contiene tu clave.");
  }

  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};


const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

const getEditPrompt = (option: EditOption): string => {
    switch(option) {
        case 'Amueblado Virtual':
            return "You are an expert interior designer. Add tasteful, modern, and stylish furniture to this empty or sparsely furnished room to make it look attractive for a real estate listing. The result should be photorealistic.";
        case 'Vaciar Espacio':
            return "You are a professional real estate photo editor. Your task is to completely empty this room. Remove every piece of furniture, decoration, and any object that is not part of the building's structure (like windows, doors, walls). The final image must show a completely empty room, with the floors, walls, and ceiling filled in realistically and seamlessly where objects were removed. Do not add anything to the image. Only remove objects.";
        default:
            return '';
    }
}

export const editImage = async (
    base64: string,
    mimeType: string,
    option: EditOption
): Promise<string> => {
    const prompt = getEditPrompt(option);
    if (!prompt) return base64;
    
    try {
        const localAi = getAiClient();
        const response: GenerateContentResponse = await localAi.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    fileToGenerativePart(base64, mimeType),
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("La IA no generó una imagen.");

    } catch (error) {
        console.error("Error al editar la imagen:", error);
        if (error instanceof Error) {
            if (error.message.toLowerCase().includes("api key")) {
                 throw new Error("La clave de la API es inválida o no está configurada. Revisa tu archivo 'env.js'.");
            }
            // Re-lanzar el error original para mensajes más específicos (ej. timeouts, etc.)
            throw error;
        }
        throw new Error("No se pudo editar la imagen. Inténtalo de nuevo.");
    }
};

export const generateAdText = async (
    images: ImageFile[],
    config: AdConfig
): Promise<string> => {
    try {
        const localAi = getAiClient();
        const imageParts = images.map(img => fileToGenerativePart(img.base64.split(',')[1], img.file.type));
        
        const prompt = `
            Actúa como un experto redactor de anuncios inmobiliarios.
            Basándote en las siguientes imágenes de una propiedad, crea un texto de anuncio atractivo.
            
            Parámetros:
            - Público objetivo: ${config.audience}
            - Tono: ${config.tone}
            - Extensión: ${config.length}
            
            Analiza las imágenes para resaltar las mejores características de la propiedad como la luz, el espacio, los acabados y el estilo general. Estructura el texto de forma coherente y persuasiva. No menciones el número de imágenes que has visto. Empieza directamente con el anuncio.
        `;

        const response = await localAi.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{text: prompt}, ...imageParts] },
        });
        
        return response.text;

    } catch (error) {
        console.error("Error al generar el texto del anuncio:", error);
         if (error instanceof Error) {
            if (error.message.toLowerCase().includes("api key")) {
                 throw new Error("La clave de la API es inválida o no está configurada. Revisa tu archivo 'env.js'.");
            }
            throw error;
        }
        throw new Error("No se pudo generar el texto del anuncio. Inténtalo de nuevo.");
    }
};