import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface PartManagementProps {
  partId: string;
  partName: string;
  description: string;
  price: number;
  selectedMeshes: string[];
  onMeshSelect: (partId: string, meshName: string) => void;
  onSaveChanges: (pendingMeshes: string[]) => void;
  allMeshes: string[];
  assignedMeshes: Record<string, string[]>;
}

const PartManagement = ({
  partId,
  partName,
  description,
  price,
  selectedMeshes,
  onMeshSelect,
  onSaveChanges,
  allMeshes,
  assignedMeshes
}: PartManagementProps) => {
  const [hideMeshes, setHideMeshes] = useState(false);
  const [pendingSelections, setPendingSelections] = useState<string[]>([...selectedMeshes]);

  const getAvailableMeshes = () => {
    const availableMeshes = new Set(allMeshes);
    
    Object.entries(assignedMeshes).forEach(([currentPartId, meshes]) => {
      if (currentPartId !== partId) {
        meshes.forEach(mesh => availableMeshes.delete(mesh));
      }
    });

    pendingSelections.forEach(mesh => availableMeshes.add(mesh));
    selectedMeshes.forEach(mesh => availableMeshes.add(mesh));

    console.log('Available meshes calculation:', {
      allMeshes,
      assignedToOthers: Object.entries(assignedMeshes)
        .filter(([id]) => id !== partId)
        .map(([_, meshes]) => meshes)
        .flat(),
      pendingSelections,
      selectedMeshes,
      result: Array.from(availableMeshes)
    });

    return Array.from(availableMeshes);
  };

  const handleMeshSelect = (meshName: string) => {
    setPendingSelections(prev => {
      if (prev.includes(meshName)) {
        return prev.filter(m => m !== meshName);
      } else {
        for (const [currentPartId, meshes] of Object.entries(assignedMeshes)) {
          if (currentPartId !== partId && meshes.includes(meshName)) {
            toast({
              title: "Warning",
              description: `This mesh is already assigned to ${currentPartId}`,
              variant: "destructive",
            });
            return prev;
          }
        }
        return [...prev, meshName];
      }
    });
  };

  const toggleMeshVisibility = () => {
    setHideMeshes(!hideMeshes);
    toast({
      title: hideMeshes ? "Showing all meshes" : "Hiding unassigned meshes",
      description: "Updated mesh visibility in the 3D viewer",
    });
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div className="flex items-center justify-end gap-2">
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
  );
};

export default PartManagement;