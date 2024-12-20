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

  const getUnassignedMeshes = () => {
    const allAssignedMeshes = new Set(
      Object.values(assignedMeshes).flat()
    );
    return allMeshes.filter(mesh => !allAssignedMeshes.has(mesh));
  };

  // Get meshes that should be visible in this part's viewer
  const getVisibleMeshes = () => {
    // Show meshes that are:
    // 1. Currently assigned to this part
    // 2. Currently in pending selections
    // 3. Not assigned to any other part
    const visibleMeshes = new Set([
      ...selectedMeshes,
      ...pendingSelections,
      ...getUnassignedMeshes()
    ]);

    // Filter out meshes that are assigned to other parts
    Object.entries(assignedMeshes).forEach(([currentPartId, meshes]) => {
      if (currentPartId !== partId) {
        meshes.forEach(mesh => visibleMeshes.delete(mesh));
      }
    });

    return Array.from(visibleMeshes);
  };

  const handleMeshSelect = (meshName: string) => {
    setPendingSelections(prev => {
      if (prev.includes(meshName)) {
        return prev.filter(m => m !== meshName);
      } else {
        // Check if mesh is assigned to another part
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

  const handleSaveChanges = () => {
    onSaveChanges(pendingSelections);
  };

  const toggleMeshVisibility = () => {
    setHideMeshes(!hideMeshes);
    toast({
      title: hideMeshes ? "Showing all meshes" : "Hiding unassigned meshes",
      description: "Updated mesh visibility in the 3D viewer",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{description}</p>
          <p className="text-sm text-gray-500">
            {selectedMeshes.length} assigned, {pendingSelections.length - selectedMeshes.length} pending
          </p>
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
          pendingSelections={pendingSelections}
          onMeshSelect={handleMeshSelect}
          visibleMeshes={getVisibleMeshes()}
          hideMeshes={hideMeshes}
        />
        <div className="absolute bottom-4 left-4 text-sm text-gaming-text/70">
          Click meshes to select • Blue = assigned • Orange = pending • Gray = unassigned
        </div>
      </div>

      <Button 
        onClick={handleSaveChanges}
        className="w-full bg-gaming-accent hover:bg-gaming-accent/80"
        disabled={pendingSelections.length === selectedMeshes.length}
      >
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
};

export default PartManagement;