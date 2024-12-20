import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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

  return (
    <div className="space-y-6 p-6 bg-gaming-background text-gaming-text">
      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="configuration" className="border border-gaming-accent/20 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-2 hover:bg-gaming-accent/10">
            Configuration Panel
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <ConfigurationPanel visibleParts={Object.values(config.meshMap).flat()} />
          </AccordionContent>
        </AccordionItem>

        {Object.keys(config.meshMap).map((part) => (
          <AccordionItem 
            key={part} 
            value={part}
            className="border border-gaming-accent/20 rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-2 hover:bg-gaming-accent/10">
              {config.partDetails[part].name} Configuration
            </AccordionTrigger>
            <AccordionContent className="p-4">
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
                  setConfig({
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
                  });
                  setJsonConfig(JSON.stringify(config, null, 2));
                }}
                onMeshSelect={(partId, meshName) => {
                  setCurrentPart(partId);
                  handleMeshSelect(meshName);
                }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}

        <AccordionItem value="json" className="border border-gaming-accent/20 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-2 hover:bg-gaming-accent/10">
            JSON Configuration
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <JsonConfigPanel 
              jsonConfig={jsonConfig}
              setJsonConfig={setJsonConfig}
              setConfig={setConfig}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PCPartsAdmin;