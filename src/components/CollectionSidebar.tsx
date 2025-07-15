
import { Folder, FolderOpen, Hash, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollectionSidebarProps {
  collections: string[];
  selectedCollection: string;
  onSelectCollection: (collection: string) => void;
}

export const CollectionSidebar = ({ 
  collections, 
  selectedCollection, 
  onSelectCollection 
}: CollectionSidebarProps) => {
  const getCollectionIcon = (collection: string) => {
    if (collection === 'Tous') return Hash;
    return selectedCollection === collection ? FolderOpen : Folder;
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Palette className="h-6 w-6 text-violet-600" />
          <h2 className="font-semibold text-slate-800">Collections</h2>
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
                    ? "bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4",
                  isSelected ? "text-violet-600" : "text-slate-400"
                )} />
                <span className="truncate">{collection}</span>
                {collection === 'Tous' && (
                  <span className="ml-auto text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {collections.length - 1}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-gradient-to-br from-violet-50 to-blue-50 rounded-lg border border-violet-100">
          <h3 className="font-medium text-slate-800 mb-2">💡 Astuce</h3>
          <p className="text-sm text-slate-600">
            Organisez vos prompts par style, technique ou projet pour retrouver facilement vos références.
          </p>
        </div>
      </div>
    </aside>
  );
};
