
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Reference {
  title: string;
  prompt: string;
  image: string;
  tags: string[];
  collection: string;
  model?: string;
  parameters?: string;
}

interface AddReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (reference: Reference) => void;
}

export const AddReferenceModal = ({ isOpen, onClose, onAdd }: AddReferenceModalProps) => {
  const [formData, setFormData] = useState<Reference>({
    title: '',
    prompt: '',
    image: '',
    tags: [],
    collection: '',
    model: '',
    parameters: ''
  });
  const [currentTag, setCurrentTag] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.prompt || !formData.image || !formData.collection) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onAdd(formData);
    toast.success('Référence ajoutée avec succès !');
    
    // Reset form
    setFormData({
      title: '',
      prompt: '',
      image: '',
      tags: [],
      collection: '',
      model: '',
      parameters: ''
    });
    setImageFile(null);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            Ajouter une nouvelle référence
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Image *</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-violet-400 transition-colors">
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: '' }));
                      setImageFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600 mb-2">Cliquez pour télécharger une image</p>
                  <p className="text-sm text-slate-500">PNG, JPG, WebP jusqu'à 10MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Nom de votre référence"
              required
            />
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt *</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Décrivez le prompt utilisé pour générer cette image..."
              rows={4}
              required
            />
          </div>

          {/* Collection */}
          <div className="space-y-2">
            <Label htmlFor="collection">Collection *</Label>
            <Input
              id="collection"
              value={formData.collection}
              onChange={(e) => setFormData(prev => ({ ...prev, collection: e.target.value }))}
              placeholder="Ex: Portraits, Landscapes, Abstract..."
              required
            />
          </div>

          {/* Model */}
          <div className="space-y-2">
            <Label htmlFor="model">Modèle IA</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              placeholder="Ex: Midjourney v6, DALL-E 3, Stable Diffusion..."
            />
          </div>

          {/* Parameters */}
          <div className="space-y-2">
            <Label htmlFor="parameters">Paramètres</Label>
            <Input
              id="parameters"
              value={formData.parameters}
              onChange={(e) => setFormData(prev => ({ ...prev, parameters: e.target.value }))}
              placeholder="Ex: --ar 16:9 --style raw, HD quality..."
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ajouter un tag et appuyer sur Entrée"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={!currentTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
            >
              Ajouter la référence
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
