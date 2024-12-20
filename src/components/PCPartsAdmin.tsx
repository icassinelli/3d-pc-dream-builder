import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import ConfigurationPanel from './ConfigurationPanel';
import JsonConfigPanel from './JsonConfigPanel';
import { ConfigData } from '@/types/config';
import { Button } from './ui/button';
import PartManagement from './PartManagement';
import { toast } from '@/hooks/use-toast';

interface PCPartsAdminProps {
  availableMeshes: string[];
}

const PCPartsAdmin = ({ availableMeshes }: PCPartsAdminProps) => {
  const [selectedMeshes, setSelectedMeshes] = useState<string[]>([]);
  const [config, setConfig] = useState<ConfigData>({
    meshMap: {
      "Monitor": [],
      "PC": [],
      "Keyboard": [],
      "Mouse": [],
      "Speakers": [],
      "NonConfigurable": []
    },
    partDetails: {
      "Monitor": {
        name: '27" Gaming Monitor',
        price: 299.99,
        description: "1440p 165Hz Display",
        isConfigurable: true
      },
      "PC": {
        name: "Gaming Tower",
        price: 1499.99,
        description: "RTX 4070, i7, 32GB RAM",
        isConfigurable: true
      },
      "Keyboard": {
        name: "Mechanical Keyboard",
        price: 149.99,
        description: "RGB Mechanical Switches",
        isConfigurable: true
      },
      "Mouse": {
        name: "Gaming Mouse",
        price: 79.99,
        description: "16000 DPI Optical Sensor",
        isConfigurable: true
      },
      "Speakers": {
        name: "2.1 Speaker System",
        price: 199.99,
        description: "THX Certified Audio",
        isConfigurable: true
      },
      "NonConfigurable": {
        name: "Non-Configurable Items",
        price: 0,
        description: "Items that are always visible",
        isConfigurable: false
      }
    }
  });
  
  const [jsonConfig, setJsonConfig] = useState(JSON.stringify(config, null, 2));
  const [currentPart, setCurrentPart] = useState<string>("Monitor");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);

  const handleMeshSelect = (partId: string, meshName: string) => {
    setSelectedMeshes(prev => {
      const newSelection = prev.includes(meshName) 
        ? prev.filter(name => name !== meshName)
        : [...prev, meshName];
      return newSelection;
    });
  };

  const handleSaveChanges = (partId: string) => {
    const newConfig = {
      ...config,
      meshMap: {
        ...config.meshMap,
        [partId]: selectedMeshes
      }
    };
    setConfig(newConfig);
    setJsonConfig(JSON.stringify(newConfig, null, 2));
    toast({
      title: "Success",
      description: "Mesh selections saved successfully",
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6 p-6 bg-gaming-background text-gaming-text">
      <div className="space-y-3">
        {/* Part Configuration Sections */}
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
                  onSaveChanges={() => handleSaveChanges(part)}
                />
              </div>
            )}
          </div>
        ))}

        {/* Advanced Tools Button */}
        <Button
          variant="outline"
          className="w-full mt-4 bg-[#1A1F2C] border-gaming-accent/30 text-gaming-accent hover:bg-[#1F242F] hover:border-gaming-accent/50"
          onClick={() => setShowAdvancedTools(!showAdvancedTools)}
        >
          <Settings2 className="w-4 h-4 mr-2" />
          Advanced Tools
        </Button>

        {/* Advanced Tools Section */}
        {showAdvancedTools && (
          <div className="space-y-3 animate-part-in">
            {/* Configuration Panel Section */}
            <div className="bg-[#1A1F2C] rounded-lg overflow-hidden">
              <div 
                className="p-4 hover:bg-[#1F242F] transition-colors cursor-pointer"
                onClick={() => toggleSection('configuration')}
              >
                <div className="flex justify-between items-center">
                  <span>Configuration Panel</span>
                </div>
              </div>
              {expandedSection === 'configuration' && (
                <div className="p-4 border-t border-gaming-accent/10 animate-part-in">
                  <ConfigurationPanel visibleParts={Object.values(config.meshMap).flat()} />
                </div>
              )}
            </div>

            {/* JSON Configuration Section */}
            <div className="bg-[#1A1F2C] rounded-lg overflow-hidden">
              <div 
                className="p-4 hover:bg-[#1F242F] transition-colors cursor-pointer"
                onClick={() => toggleSection('json')}
              >
                <div className="flex justify-between items-center">
                  <span>JSON Configuration</span>
                </div>
              </div>
              {expandedSection === 'json' && (
                <div className="p-4 border-t border-gaming-accent/10 animate-part-in">
                  <JsonConfigPanel 
                    jsonConfig={jsonConfig}
                    setJsonConfig={setJsonConfig}
                    setConfig={setConfig}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PCPartsAdmin;
