
import { useState } from 'react';
import { Search, Plus, Filter, Grid, List, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReferenceCard } from '@/components/ReferenceCard';
import { AddReferenceModal } from '@/components/AddReferenceModal';
import { CollectionSidebar } from '@/components/CollectionSidebar';

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

const Index = () => {
  const [references, setReferences] = useState<Reference[]>([
    {
      id: '1',
      title: 'Portrait Cyberpunk',
      prompt: 'Portrait of a cyberpunk woman with neon hair, futuristic city background, cinematic lighting, highly detailed, 8k resolution',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
      tags: ['portrait', 'cyberpunk', 'neon', 'futuristic'],
      collection: 'Portraits',
      createdAt: new Date(),
      model: 'Midjourney v6',
      parameters: '--ar 1:1 --style raw'
    },
    {
      id: '2',
      title: 'Fantasy Landscape',
      prompt: 'Mystical forest with floating islands, magical glowing crystals, ethereal lighting, fantasy art style, concept art',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop',
      tags: ['landscape', 'fantasy', 'magical', 'forest'],
      collection: 'Landscapes',
      createdAt: new Date(),
      model: 'DALL-E 3',
      parameters: 'HD quality'
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('Tous');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const collections = ['Tous', ...Array.from(new Set(references.map(ref => ref.collection)))];

  const filteredReferences = references.filter(ref => {
    const matchesSearch = ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ref.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ref.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCollection = selectedCollection === 'Tous' || ref.collection === selectedCollection;
    return matchesSearch && matchesCollection;
  });

  const addReference = (newReference: Omit<Reference, 'id' | 'createdAt'>) => {
    const reference: Reference = {
      ...newReference,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setReferences(prev => [reference, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <CollectionSidebar 
            collections={collections}
            selectedCollection={selectedCollection}
            onSelectCollection={setSelectedCollection}
          />
        </div>

        {/* Mobile Sidebar */}
        <CollectionSidebar 
          collections={collections}
          selectedCollection={selectedCollection}
          onSelectCollection={(collection) => {
            setSelectedCollection(collection);
            setIsSidebarOpen(false); // Close sidebar after selection on mobile
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 p-4 md:p-6 lg:ml-0">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            {/* Mobile menu button */}
            <div className="flex items-center gap-4 mb-4 lg:hidden">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
              >
                <Menu className="h-5 w-5 text-white" />
              </button>
              <h1 className="text-xl font-bold text-white neon-purple neon-glow">
                Bibliothèque IA
              </h1>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="hidden lg:block">
                <h1 className="text-3xl md:text-4xl font-bold text-white neon-purple neon-glow animate-neon-pulse">
                  Bibliothèque IA
                </h1>
                <p className="text-muted-foreground mt-2 text-sm md:text-base">
                  Organisez vos références de prompts et images d'IA générative
                </p>
              </div>
              
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground neon-border w-full md:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une référence
              </Button>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre, prompt ou tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border neon-cyan/20 focus:neon-border text-white placeholder:text-muted-foreground text-sm"
                />
              </div>
              
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'neon-border' : ''}
                >
                  <Grid className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Grille</span>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'neon-border' : ''}
                >
                  <List className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Liste</span>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
              <span className="neon-cyan">{filteredReferences.length} référence{filteredReferences.length !== 1 ? 's' : ''}</span>
              <span className="neon-purple">•</span>
              <span className="neon-violet">{collections.length - 1} collection{collections.length !== 2 ? 's' : ''}</span>
            </div>
          </div>

          {/* References Grid */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6 justify-items-center sm:justify-items-stretch" 
            : "space-y-3 md:space-y-4 flex flex-col items-center sm:items-stretch"
          }>
            {filteredReferences.map(reference => (
              <ReferenceCard 
                key={reference.id}
                reference={reference}
                viewMode={viewMode}
              />
            ))}
          </div>

          {filteredReferences.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white text-lg mb-2 neon-purple neon-glow">Aucune référence trouvée</div>
              <p className="text-muted-foreground text-sm md:text-base">
                {searchQuery || selectedCollection !== 'Tous' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par ajouter votre première référence'
                }
              </p>
            </div>
          )}
        </main>
      </div>

      <AddReferenceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addReference}
      />
    </div>
  );
};

export default Index;
