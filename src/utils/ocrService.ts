import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

let ocrPipeline: any = null;

export class OCRService {
  static async initializeOCR() {
    if (!ocrPipeline) {
      console.log('Initializing OCR pipeline...');
      try {
        ocrPipeline = await pipeline(
          'image-to-text',
          'Xenova/trocr-base-printed',
          { device: 'webgpu' }
        );
        console.log('OCR pipeline initialized successfully');
      } catch (error) {
        console.warn('WebGPU not available, falling back to CPU');
        ocrPipeline = await pipeline(
          'image-to-text',
          'Xenova/trocr-base-printed'
        );
      }
    }
    return ocrPipeline;
  }

  static async extractTextFromImage(imageFile: File): Promise<string> {
    try {
      console.log('Starting OCR text extraction...');
      
      // Initialize OCR if needed
      const ocr = await this.initializeOCR();
      
      // Convert file to image URL
      const imageUrl = URL.createObjectURL(imageFile);
      
      // Process the image
      const result = await ocr(imageUrl);
      
      // Clean up the URL
      URL.revokeObjectURL(imageUrl);
      
      console.log('OCR result:', result);
      
      // Extract text from result
      let extractedText = '';
      if (Array.isArray(result)) {
        extractedText = result.map(item => item.generated_text || '').join(' ');
      } else if (result.generated_text) {
        extractedText = result.generated_text;
      }
      
      // Clean up the text
      extractedText = extractedText.trim().replace(/\s+/g, ' ');
      
      console.log('Extracted text:', extractedText);
      return extractedText;
      
    } catch (error) {
      console.error('Error during OCR:', error);
      throw new Error('Erreur lors de l\'extraction du texte. Veuillez réessayer.');
    }
  }

  static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}