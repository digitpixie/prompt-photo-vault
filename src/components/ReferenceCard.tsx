
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Eye, MoreHorizontal, Calendar, Cpu } from 'lucide-react';
import { toast } from 'sonner';
import { ReferenceDetailModal } from './ReferenceDetailModal';

interface Reference {
  id: string;
  title: string;
  prompt: string;
  image: string;
  tags: string[];
  collection: string;
  type: 'photo' | 'video';
  createdAt: Date;
  model?: string;
  parameters?: string;
}

interface ReferenceCardProps {
  reference: Reference;
  viewMode: 'grid' | 'list';
}

export const ReferenceCard = ({ reference, viewMode }: ReferenceCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const copyPrompt = () => {
    navigator.clipboard.writeText(reference.prompt);
    toast.success('Prompt copié dans le presse-papier !');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  if (viewMode === 'list') {
    return (
      <>
        <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card w-full max-w-sm sm:max-w-none mx-auto sm:mx-0">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
              <img
                src={reference.image}
                alt={reference.title}
                className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
              />
            </div>
            
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white truncate text-sm sm:text-base">{reference.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDetailOpen(true)}
                  className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-white text-xs sm:text-sm mb-3 overflow-hidden">{reference.prompt.slice(0, 100)}...</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap gap-1">
                  {reference.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {reference.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{reference.tags.length - 2}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <span className="text-xs text-white flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(reference.createdAt)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyPrompt}
                    className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <ReferenceDetailModal
          reference={reference}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 border-border bg-card overflow-hidden w-full max-w-xs sm:max-w-none">
        <div className="relative">
          <img
            src={reference.image}
            alt={reference.title}
            className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDetailOpen(true)}
              className="bg-white/90 hover:bg-white text-black"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white truncate text-sm sm:text-base">{reference.title}</h3>
            <div className="flex gap-1 flex-shrink-0">
              <Badge variant="outline" className="text-xs">{reference.type === 'photo' ? '📸' : '🎬'}</Badge>
              <Badge variant="outline" className="text-xs">{reference.collection}</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-2 px-3 sm:px-6">
          <p className="text-white text-xs sm:text-sm mb-3 overflow-hidden">{reference.prompt.slice(0, 120)}...</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {reference.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {reference.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{reference.tags.length - 2}
              </Badge>
            )}
          </div>

          {reference.model && (
            <div className="flex items-center gap-1 text-xs text-white mb-2">
              <Cpu className="h-3 w-3" />
              <span className="truncate">{reference.model}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 px-3 sm:px-6 pb-3 sm:pb-6 flex items-center justify-between">
          <span className="text-xs text-white flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span className="hidden sm:inline">{formatDate(reference.createdAt)}</span>
            <span className="sm:hidden">{new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(reference.createdAt)}</span>
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyPrompt}
            className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <ReferenceDetailModal
        reference={reference}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
};
