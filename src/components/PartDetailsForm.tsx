import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MeshSelector from './MeshSelector';
import { Monitor, PcCase, Keyboard, Mouse, Speaker, Settings } from 'lucide-react';

const AVAILABLE_ICONS = [
  { value: 'monitor', label: 'Monitor', icon: Monitor },
  { value: 'pc-case', label: 'PC Case', icon: PcCase },
  { value: 'keyboard', label: 'Keyboard', icon: Keyboard },
  { value: 'mouse', label: 'Mouse', icon: Mouse },
  { value: 'speaker', label: 'Speaker', icon: Speaker },
  { value: 'settings', label: 'Settings', icon: Settings },
];

interface Part {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  isConfigurable: boolean;
  icon?: string;
  meshNames: string[];
}

interface PartDetailsFormProps {
  part: Part;
  onUpdate: (updatedPart: Part) => void;
  onMeshSelect: (partId: string, meshName: string) => void;
}

const PartDetailsForm = ({ part, onUpdate, onMeshSelect }: PartDetailsFormProps) => {
  const [localPart, setLocalPart] = useState(part);

  useEffect(() => {
    setLocalPart(part);
  }, [part]);

  const handleSaveChanges = () => {
    onUpdate(localPart);
  };

  return (
    <div className="space-y-6 animate-part-in">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-sm text-gray-400">Title</Label>
          <Input
            value={localPart.name}
            onChange={(e) => setLocalPart({ ...localPart, name: e.target.value })}
            className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
            placeholder="Display name for the part"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-400">Part Code</Label>
          <Input
            value={localPart.code}
            onChange={(e) => setLocalPart({ ...localPart, code: e.target.value })}
            className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
            placeholder="e.g., Monitor, PC"
          />
        </div>

        <div className="flex items-end">
          <div className="flex items-center space-x-2">
            <Switch
              id="configurable"
              checked={localPart.isConfigurable}
              onCheckedChange={(checked) => setLocalPart({ ...localPart, isConfigurable: checked })}
              className="data-[state=checked]:bg-gaming-accent"
            />
            <Label htmlFor="configurable" className="text-sm text-gray-400">
              Configurable Part
            </Label>
          </div>
        </div>

        {localPart.isConfigurable && (
          <>
            <div>
              <Label className="text-sm text-gray-400">Icon</Label>
              <Select
                value={localPart.icon || 'settings'}
                onValueChange={(value) => setLocalPart({ ...localPart, icon: value })}
              >
                <SelectTrigger className="bg-gaming-muted text-gaming-text border-gaming-accent/20">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ICONS.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      <div className="flex items-center gap-2">
                        <icon.icon className="w-4 h-4" />
                        <span>{icon.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-gray-400">Description</Label>
              <Input
                value={localPart.description}
                onChange={(e) => setLocalPart({ ...localPart, description: e.target.value })}
                className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
                placeholder="Part description"
              />
            </div>

            <div>
              <Label className="text-sm text-gray-400">Price</Label>
              <Input
                type="number"
                value={localPart.price}
                onChange={(e) => setLocalPart({ ...localPart, price: parseFloat(e.target.value) || 0 })}
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
          selectedMeshes={localPart.meshNames}
          onMeshSelect={(meshName) => onMeshSelect(localPart.id, meshName)}
          pendingSelections={[]}
          visibleMeshes={localPart.meshNames}
          hideMeshes={false}
        />
      </div>

      <Button 
        onClick={handleSaveChanges}
        className="w-full bg-gaming-accent hover:bg-gaming-accent/80"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
};

export default PartDetailsForm;