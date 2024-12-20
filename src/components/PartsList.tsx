import { ChevronDown, ChevronUp } from 'lucide-react';

interface Part {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  isConfigurable: boolean;
  meshNames: string[];
}

interface PartsListProps {
  parts: Part[];
  expandedPartId: string | null;
  onToggleExpand: (partId: string) => void;
  children: (part: Part) => React.ReactNode;
}

const PartsList = ({ parts, expandedPartId, onToggleExpand, children }: PartsListProps) => {
  return (
    <div className="space-y-3">
      {parts.map((part) => (
        <div
          key={part.id}
          className="bg-[#1A1F2C] rounded-lg overflow-hidden"
        >
          <div 
            className="p-4 hover:bg-[#1F242F] transition-colors cursor-pointer"
            onClick={() => onToggleExpand(part.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button className="text-gray-400">
                  {expandedPartId === part.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                <span>{part.name}</span>
                <span className="text-sm text-gray-500">{part.meshNames.length} meshes</span>
              </div>
              <div className="text-gaming-accent">${part.price}</div>
            </div>
          </div>

          {expandedPartId === part.id && (
            <div className="p-4 border-t border-gaming-accent/10 animate-part-in">
              {children(part)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PartsList;