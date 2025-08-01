
import { Folder, FolderOpen, Hash, Palette, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollectionSidebarProps {
  collections: string[];
  selectedCollection: string;
  onSelectCollection: (collection: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const CollectionSidebar = ({ 
  collections, 
  selectedCollection, 
  onSelectCollection,
  isOpen = true,
  onClose
}: CollectionSidebarProps) => {
  const getCollectionIcon = (collection: string) => {
    if (collection === 'Tous') return Hash;
    return selectedCollection === collection ? FolderOpen : Folder;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "w-64 bg-card border-r border-border h-screen sticky top-0 z-50 transition-transform duration-300",
        "lg:translate-x-0", // Always visible on desktop
        !isOpen && onClose && "-translate-x-full", // Hidden on mobile when closed
        isOpen && onClose && "fixed" // Fixed positioning on mobile when open
      )}>
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Palette className="h-6 w-6 neon-purple" />
              <h2 className="font-semibold text-white">Collections</h2>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded-md hover:bg-muted text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

        <nav className="space-y-1">
          {collections.map((collection) => {
            const Icon = getCollectionIcon(collection);
            const isSelected = selectedCollection === collection;
            
            return (
              <button
                key={collection}
                onClick={() => onSelectCollection(collection)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                  isSelected
                    ? "bg-primary text-primary-foreground neon-border"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4",
                  isSelected ? "text-primary-foreground" : "text-muted-foreground"
                )} />
                <span className="truncate">{collection}</span>
                {collection === 'Tous' && (
                  <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    {collections.length - 1}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border neon-border">
          <h3 className="font-medium text-white mb-2 neon-cyan">💡 Astuce</h3>
          <p className="text-sm text-muted-foreground">
            Organisez vos prompts par style, technique ou projet pour retrouver facilement vos références.
          </p>
        </div>
      </div>
    </aside>
    </>
  );
};
