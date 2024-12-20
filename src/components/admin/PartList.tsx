import { ConfigData } from '@/types/config';
import PartManagement from '../PartManagement';
import { toast } from '@/hooks/use-toast';

interface PartListProps {
  config: ConfigData;
  setConfig: (config: ConfigData) => void;
  setJsonConfig: (json: string) => void;
  expandedSection: string | null;
  toggleSection: (section: string) => void;
  availableMeshes: string[];
}

const PartList = ({ 
  config, 
  setConfig, 
  setJsonConfig,
  expandedSection, 
  toggleSection,
  availableMeshes 
}: PartListProps) => {
  const handleMeshSelect = (partId: string, meshNames: string) => {
    const meshArray = meshNames.split(',').filter(Boolean);
    const newConfig = {
      ...config,
      meshMap: {
        ...config.meshMap,
        [partId]: meshArray
      }
    };
    setConfig(newConfig);
    setJsonConfig(JSON.stringify(newConfig, null, 2));
  };

  const handleSaveChanges = (partId: string, pendingMeshes: string[]) => {
    const updatedMeshMap = { ...config.meshMap };
    
    Object.keys(updatedMeshMap).forEach(part => {
      if (part !== partId) {
        updatedMeshMap[part] = updatedMeshMap[part].filter(
          mesh => !pendingMeshes.includes(mesh)
        );
      }
    });

    updatedMeshMap[partId] = pendingMeshes;
    const newConfig = { ...config, meshMap: updatedMeshMap };
    
    setConfig(newConfig);
    setJsonConfig(JSON.stringify(newConfig, null, 2));

    toast({
      title: "Changes Saved",
      description: `Updated mesh assignments for ${config.partDetails[partId].name}`,
    });
  };

  return (
    <div className="space-y-3">
      {Object.keys(config.meshMap).map((part) => (
        <div key={part} className="bg-[#1A1F2C] rounded-lg overflow-hidden">
          <div 
            className="p-4 hover:bg-[#1F242F] transition-colors cursor-pointer"
            onClick={() => toggleSection(part)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>{config.partDetails[part].name}</span>
                <span className="text-sm text-gray-500">
                  {config.meshMap[part].length} meshes
                </span>
              </div>
              <span className="text-gaming-accent">
                ${config.partDetails[part].price}
              </span>
            </div>
          </div>
          {expandedSection === part && (
            <div className="p-4 border-t border-gaming-accent/10 animate-part-in">
              <PartManagement
                partId={part}
                partName={config.partDetails[part].name}
                description={config.partDetails[part].description}
                price={config.partDetails[part].price}
                selectedMeshes={config.meshMap[part]}
                onMeshSelect={handleMeshSelect}
                onSaveChanges={(pendingMeshes) => handleSaveChanges(part, pendingMeshes)}
                allMeshes={availableMeshes}
                assignedMeshes={config.meshMap}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PartList;