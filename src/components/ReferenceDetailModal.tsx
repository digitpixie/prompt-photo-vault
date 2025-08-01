
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Calendar, Cpu, Settings, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Reference {
  id: string;
  title: string;
  prompt: string;
  image: string;
  tags: string[];
  collection: string;
  createdAt: Date;
  model?: string;
  parameters?: string;
}

interface ReferenceDetailModalProps {
  reference: Reference;
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceDetailModal = ({ reference, isOpen, onClose }: ReferenceDetailModalProps) => {
  const copyPrompt = () => {
    navigator.clipboard.writeText(reference.prompt);
    toast.success('Prompt copié dans le presse-papier !');
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = reference.image;
    link.download = `${reference.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Téléchargement de l\'image...');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center justify-between">
            {reference.title}
            <Badge variant="outline">{reference.collection}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image */}
          <div className="space-y-4">
            <img
              src={reference.image}
              alt={reference.title}
              className="w-full rounded-lg shadow-md"
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={downloadImage}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button
                onClick={copyPrompt}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground neon-border"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copier le prompt
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Prompt */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Prompt</h3>
              <div className="bg-muted rounded-lg p-4 border border-border">
                <p className="text-foreground leading-relaxed">{reference.prompt}</p>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 gap-4">
              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Créé le {formatDate(reference.createdAt)}</span>
              </div>

              {/* Model */}
              {reference.model && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Cpu className="h-4 w-4" />
                  <span>{reference.model}</span>
                </div>
              )}

              {/* Parameters */}
              {reference.parameters && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Settings className="h-4 w-4" />
                  <code className="bg-muted px-2 py-1 rounded text-xs text-foreground">
                    {reference.parameters}
                  </code>
                </div>
              )}
            </div>

            {/* Tags */}
            {reference.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {reference.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-muted/50 p-4 rounded-lg border border-border neon-border">
              <h4 className="font-medium text-foreground mb-2 neon-cyan">💡 Conseils d'utilisation</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Adaptez le prompt selon votre modèle IA</li>
                <li>• Testez différents paramètres pour varier les résultats</li>
                <li>• Combinez plusieurs techniques pour plus de créativité</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
