import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, Scan, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { OCRService } from '@/utils/ocrService';

interface PromptScannerProps {
  onTextExtracted: (text: string) => void;
  children: React.ReactNode;
}

export const PromptScanner = ({ onTextExtracted, children }: PromptScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setProgress(10);
    setExtractedText('');

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 85));
      }, 500);

      const text = await OCRService.extractTextFromImage(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (text.trim()) {
        setExtractedText(text);
        toast.success('Texte extrait avec succès !');
      } else {
        toast.warning('Aucun texte détecté dans l\'image. Vérifiez que le texte est bien visible.');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Erreur lors de l\'extraction du texte. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('L\'image est trop volumineuse. Limite : 10MB');
        return;
      }
      processImage(file);
    }
  };

  const useExtractedText = () => {
    console.log('useExtractedText called with:', extractedText);
    if (extractedText.trim()) {
      console.log('Calling onTextExtracted with:', extractedText);
      onTextExtracted(extractedText);
      setIsOpen(false);
      resetScanner();
      toast.success('Texte appliqué au prompt !');
    } else {
      console.log('No extracted text to use');
    }
  };

  const resetScanner = () => {
    setExtractedText('');
    setProgress(0);
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetScanner();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground neon-cyan flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Scanner un prompt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Options */}
          {!extractedText && !isProcessing && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Prenez une photo ou importez une image contenant du texte pour l'extraire automatiquement.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="h-6 w-6" />
                  <span className="text-xs">Prendre photo</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Importer image</span>
                </Button>
              </div>
              
              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Analyse de l'image en cours...
                </p>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-muted-foreground">
                  {progress < 50 ? 'Chargement du modèle...' : 'Extraction du texte...'}
                </p>
              </div>
            </div>
          )}

          {/* Extracted Text */}
          {extractedText && !isProcessing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Texte extrait :
                </label>
                <div className="p-3 bg-muted rounded-lg border max-h-32 overflow-y-auto">
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {extractedText}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="flex-1"
                >
                  Réessayer
                </Button>
                <Button
                  onClick={useExtractedText}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Utiliser ce texte
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};