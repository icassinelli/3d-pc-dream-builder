import { useState } from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import PartDetailsForm from './PartDetailsForm';
import ConfigurationPanel from './ConfigurationPanel';
import JsonConfigPanel from './JsonConfigPanel';
import { ConfigData } from '@/types/config';

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

  const handleMeshSelect = (meshName: string) => {
    setSelectedMeshes(prev => {
      const newSelection = prev.includes(meshName) 
        ? prev.filter(name => name !== meshName)
        : [...prev, meshName];
      
      const newConfig = {
        ...config,
        meshMap: {
          ...config.meshMap,
          [currentPart]: newSelection
        }
      };
      setConfig(newConfig);
      setJsonConfig(JSON.stringify(newConfig, null, 2));
      
      return newSelection;
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6 p-6 bg-gaming-background text-gaming-text">
      <div className="space-y-3">
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

        {/* Part Configuration Sections */}
        {Object.keys(config.meshMap).map((part) => (
          <div key={part} className="bg-[#1A1F2C] rounded-lg overflow-hidden">
            <div 
              className="p-4 hover:bg-[#1F242F] transition-colors cursor-pointer"
              onClick={() => toggleSection(part)}
            >
              <div className="flex justify-between items-center">
                <span>{config.partDetails[part].name}</span>
                <span className="text-gaming-accent">${config.partDetails[part].price}</span>
              </div>
            </div>
            {expandedSection === part && (
              <div className="p-4 border-t border-gaming-accent/10 animate-part-in">
                <PartDetailsForm
                  part={{
                    id: part,
                    code: part,
                    name: config.partDetails[part].name,
                    description: config.partDetails[part].description,
                    price: config.partDetails[part].price,
                    isConfigurable: config.partDetails[part].isConfigurable,
                    meshNames: config.meshMap[part]
                  }}
                  onUpdate={(updatedPart) => {
                    const newConfig = {
                      ...config,
                      partDetails: {
                        ...config.partDetails,
                        [part]: {
                          name: updatedPart.name,
                          description: updatedPart.description,
                          price: updatedPart.price,
                          isConfigurable: updatedPart.isConfigurable
                        }
                      }
                    };
                    setConfig(newConfig);
                    setJsonConfig(JSON.stringify(newConfig, null, 2));
                  }}
                  onMeshSelect={(partId, meshName) => {
                    setCurrentPart(partId);
                    handleMeshSelect(meshName);
                  }}
                />
              </div>
            )}
          </div>
        ))}

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
    </div>
  );
};

export default PCPartsAdmin;