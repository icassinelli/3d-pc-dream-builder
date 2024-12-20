import { Input } from '@/components/ui/input';
import MeshSelector from './MeshSelector';

interface PartDetail {
  name: string;
  description: string;
  price: number;
  isConfigurable: boolean;
}

interface Part {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  isConfigurable: boolean;
  meshNames: string[];
}

interface PartDetailsFormProps {
  part: Part;
  onUpdate: (updatedPart: Part) => void;
  onMeshSelect: (partId: string, meshName: string) => void;
}

const PartDetailsForm = ({ part, onUpdate, onMeshSelect }: PartDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Part Code</label>
          <Input
            value={part.code}
            onChange={(e) => onUpdate({ ...part, code: e.target.value })}
            className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
            placeholder="e.g., Monitor, PC, Keyboard"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Display Name</label>
          <Input
            value={part.name}
            onChange={(e) => onUpdate({ ...part, name: e.target.value })}
            className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Price</label>
          <Input
            type="number"
            value={part.price}
            onChange={(e) => onUpdate({ ...part, price: parseFloat(e.target.value) || 0 })}
            className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Configurable</label>
          <Input
            type="checkbox"
            checked={part.isConfigurable}
            onChange={(e) => onUpdate({ ...part, isConfigurable: e.target.checked })}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Description</label>
        <Input
          value={part.description}
          onChange={(e) => onUpdate({ ...part, description: e.target.value })}
          className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Mesh Selection</label>
        <p className="text-xs text-gray-500 mb-2">Click on parts in the 3D view to select/deselect them</p>
        <MeshSelector
          selectedMeshes={part.meshNames}
          onMeshSelect={(meshName) => onMeshSelect(part.id, meshName)}
        />
      </div>
    </div>
  );
};

export default PartDetailsForm;