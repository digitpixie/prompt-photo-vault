
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
        <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200">
          <div className="flex">
            <div className="w-32 h-32 flex-shrink-0">
              <img
                src={reference.image}
                alt={reference.title}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
            
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-800 line-clamp-1">{reference.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDetailOpen(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-slate-600 text-sm line-clamp-2 mb-3">{reference.prompt}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {reference.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {reference.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{reference.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(reference.createdAt)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyPrompt}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
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
      <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden">
        <div className="relative">
          <img
            src={reference.image}
            alt={reference.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDetailOpen(true)}
              className="bg-white/90 hover:bg-white"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-slate-800 line-clamp-1">{reference.title}</h3>
            <Badge variant="outline" className="text-xs">{reference.collection}</Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <p className="text-slate-600 text-sm line-clamp-3 mb-3">{reference.prompt}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {reference.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {reference.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{reference.tags.length - 3}
              </Badge>
            )}
          </div>

          {reference.model && (
            <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
              <Cpu className="h-3 w-3" />
              {reference.model}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(reference.createdAt)}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyPrompt}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
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
