import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
    <div className="space-y-6 animate-part-in">
      <div className="space-y-4">
        <div>
          <Label className="text-sm text-gray-400">Title</Label>
          <Input
            value={part.name}
            onChange={(e) => onUpdate({ ...part, name: e.target.value })}
            className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
            placeholder="Display name for the part"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-400">Part Code</Label>
          <Input
            value={part.code}
            onChange={(e) => onUpdate({ ...part, code: e.target.value })}
            className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
            placeholder="e.g., Monitor, PC"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="configurable"
            checked={part.isConfigurable}
            onCheckedChange={(checked) => onUpdate({ ...part, isConfigurable: checked })}
            className="data-[state=checked]:bg-gaming-accent"
          />
          <Label htmlFor="configurable" className="text-sm text-gray-400">
            Configurable Part
          </Label>
        </div>

        {part.isConfigurable && (
          <>
            <div>
              <Label className="text-sm text-gray-400">Description</Label>
              <Input
                value={part.description}
                onChange={(e) => onUpdate({ ...part, description: e.target.value })}
                className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
                placeholder="Part description"
              />
            </div>

            <div>
              <Label className="text-sm text-gray-400">Price</Label>
              <Input
                type="number"
                value={part.price}
                onChange={(e) => onUpdate({ ...part, price: parseFloat(e.target.value) || 0 })}
                className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
                placeholder="0.00"
              />
            </div>
          </>
        )}
      </div>

      <div>
        <Label className="text-sm text-gray-400 block mb-2">Mesh Selection</Label>
        <p className="text-xs text-gray-500 mb-4">Click on parts in the 3D view to select/deselect them</p>
        <MeshSelector
          selectedMeshes={part.meshNames}
          onMeshSelect={(meshName) => onMeshSelect(part.id, meshName)}
          pendingSelections={[]}
          visibleMeshes={part.meshNames}
          hideMeshes={false}
        />
      </div>
    </div>
  );
};

export default PartDetailsForm;