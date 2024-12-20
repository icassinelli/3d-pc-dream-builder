import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import MeshSelector from './MeshSelector';

interface PCPartsAdminProps {
  availableMeshes: string[];
}

interface PartDetail {
  name: string;
  description: string;
  price: number;
  isConfigurable: boolean;
}

interface ConfigData {
  meshMap: Record<string, string[]>;
  partDetails: Record<string, PartDetail>;
}

const PCPartsAdmin = ({ availableMeshes }: PCPartsAdminProps) => {
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

  const handleJsonUpdate = (newJson: string) => {
    try {
      const parsed = JSON.parse(newJson);
      setConfig(parsed);
      setJsonConfig(newJson);
      toast({
        title: "Success",
        description: "Configuration updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format",
        variant: "destructive",
      });
    }
  };

  const resetView = () => {
    // TODO: Implement reset view functionality
    toast({
      title: "Info",
      description: "View reset to default position",
    });
  };

  const setCurrentView = () => {
    // TODO: Implement save current view functionality
    toast({
      title: "Success",
      description: "Current view saved as screenshot location",
    });
  };

  return (
    <div className="space-y-6 p-6 bg-gaming-background text-gaming-text">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="screenshot">
          <AccordionTrigger className="text-gaming-text hover:text-gaming-accent">
            Screenshot Settings
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden bg-gaming-muted">
                <MeshSelector
                  selectedMeshes={[]}
                  onMeshSelect={() => {}}
                />
                <div className="absolute bottom-4 left-4 text-sm text-gaming-text/70">
                  Left click: Rotate • Right click: Pan • Scroll: Zoom
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={setCurrentView}
                  className="flex-1 bg-gaming-accent hover:bg-gaming-accent/80"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Set Current View
                </Button>
                <Button 
                  onClick={resetView}
                  variant="outline" 
                  className="flex-1 border-gaming-accent/30 text-gaming-accent hover:bg-gaming-accent/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset View
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="meshes">
          <AccordionTrigger className="text-gaming-text hover:text-gaming-accent">
            Bulk Mesh Assignment
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Textarea
                value={jsonConfig}
                onChange={(e) => setJsonConfig(e.target.value)}
                className="font-mono text-sm h-[300px] bg-gaming-muted border-gaming-accent/20"
              />
              <Button 
                onClick={() => handleJsonUpdate(jsonConfig)}
                className="w-full bg-gaming-accent hover:bg-gaming-accent/80"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="current">
          <AccordionTrigger className="text-gaming-text hover:text-gaming-accent">
            Current Configuration
          </AccordionTrigger>
          <AccordionContent>
            <pre className="bg-gaming-muted p-4 rounded-lg overflow-x-auto">
              <code>{JSON.stringify(config, null, 2)}</code>
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PCPartsAdmin;