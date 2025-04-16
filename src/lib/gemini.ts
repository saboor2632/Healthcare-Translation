import { GoogleGenerativeAI } from '@google/generative-ai';

// Check for API key
if (!process.env.GEMINI_API_KEY) {
  console.error('Missing Gemini API key - please set GEMINI_API_KEY in your .env.local file');
  throw new Error('Missing Gemini API key');
}

// Remove console.log of API key for security
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

export async function translateText({ text, sourceLang, targetLang }: TranslationRequest): Promise<string> {
  console.log('translateText called with:', { sourceLang, targetLang, textLength: text.length });
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    console.log('Gemini model initialized');

    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}:
    "${text}"
    
    Respond with ONLY the translated text, no explanations or notes.`;

    console.log('Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    console.log('Received response from Gemini');
    
    const response = await result.response;
    const translatedText = response.text().trim();
    console.log('Translation completed:', { originalText: text, translatedText });
    
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to translate text: ${error.message}`);
    }
    throw new Error('Failed to translate text: Unknown error');
  }
}

export async function improveTranscription(text: string, language: string): Promise<string> {
  console.log('improveTranscription called with:', { language, textLength: text.length });
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    console.log('Gemini model initialized for transcription improvement');

    if (!text.trim()) {
      return text;
    }

    const prompt = `Improve this text in ${language} if it contains medical terminology:
    "${text}"
    
    If it's not medical text, return it unchanged. Respond with ONLY the text, no explanations.`;

    console.log('Sending prompt to Gemini for improvement...');
    const result = await model.generateContent(prompt);
    console.log('Received improvement response from Gemini');
    
    const response = await result.response;
    const improvedText = response.text().trim();
    console.log('Transcription improvement completed:', { originalText: text, improvedText });
    
    return improvedText;
  } catch (error) {
    console.error('Transcription improvement error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to improve transcription: ${error.message}`);
    }
    throw new Error('Failed to improve transcription: Unknown error');
  }
} 