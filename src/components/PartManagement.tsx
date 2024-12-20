import { useState } from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import MeshSelector from './MeshSelector';

interface PartManagementProps {
  partId: string;
  partName: string;
  description: string;
  price: number;
  selectedMeshes: string[];
  onMeshSelect: (partId: string, meshName: string) => void;
  onSaveChanges: () => void;
}

const PartManagement = ({
  partId,
  partName,
  description,
  price,
  selectedMeshes,
  onMeshSelect,
  onSaveChanges
}: PartManagementProps) => {
  const [hideMeshes, setHideMeshes] = useState(false);

  const toggleMeshVisibility = () => {
    setHideMeshes(!hideMeshes);
    toast({
      title: hideMeshes ? "Showing selected meshes" : "Hiding selected meshes",
      description: "Updated mesh visibility in the 3D viewer",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{description}</p>
          <p className="text-sm text-gray-500">{selectedMeshes.length} meshes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMeshVisibility}
            className="border-gaming-accent/30 text-gaming-accent hover:bg-gaming-accent/10"
          >
            {hideMeshes ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <span className="text-gaming-accent">${price}</span>
        </div>
      </div>

      <div className="relative">
        <MeshSelector
          selectedMeshes={selectedMeshes}
          onMeshSelect={(meshName) => onMeshSelect(partId, meshName)}
          hideMeshes={hideMeshes}
        />
        <div className="absolute bottom-4 left-4 text-sm text-gaming-text/70">
          Click on parts to select • Orange = pending changes • Blue = saved
        </div>
      </div>

      <Button 
        onClick={onSaveChanges}
        className="w-full bg-gaming-accent hover:bg-gaming-accent/80"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
};

export default PartManagement;