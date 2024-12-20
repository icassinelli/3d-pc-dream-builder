import { Button } from '@/components/ui/button';
import { Save, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ConfigData } from '@/types/config';
import { useRef } from 'react';

interface JsonConfigPanelProps {
  jsonConfig: string;
  setJsonConfig: (value: string) => void;
  setConfig: (config: ConfigData) => void;
}

const JsonConfigPanel = ({ jsonConfig, setJsonConfig, setConfig }: JsonConfigPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateConfig = (config: any): config is ConfigData => {
    if (!config.meshMap || !config.partDetails) {
      throw new Error('Configuration must include meshMap and partDetails');
    }

    // Validate meshMap structure
    if (typeof config.meshMap !== 'object') {
      throw new Error('meshMap must be an object');
    }

    // Validate partDetails structure
    if (typeof config.partDetails !== 'object') {
      throw new Error('partDetails must be an object');
    }

    // Validate that each part in meshMap has corresponding details
    for (const part of Object.keys(config.meshMap)) {
      if (!config.partDetails[part]) {
        throw new Error(`Part "${part}" in meshMap missing details in partDetails`);
      }
      if (!Array.isArray(config.meshMap[part])) {
        throw new Error(`Meshes for part "${part}" must be an array`);
      }
    }

    // Validate part details structure
    for (const [part, details] of Object.entries<any>(config.partDetails)) {
      if (typeof details.name !== 'string') {
        throw new Error(`Part "${part}" missing name property`);
      }
      if (typeof details.price !== 'number') {
        throw new Error(`Part "${part}" price must be a number`);
      }
      if (typeof details.description !== 'string') {
        throw new Error(`Part "${part}" missing description`);
      }
      if (typeof details.isConfigurable !== 'boolean') {
        throw new Error(`Part "${part}" missing isConfigurable property`);
      }
    }

    return true;
  };

  const handleJsonUpdate = (newJson: string) => {
    try {
      const parsed = JSON.parse(newJson);
      if (validateConfig(parsed)) {
        setConfig(parsed);
        setJsonConfig(newJson);
        
        // Persist to localStorage
        localStorage.setItem('pcConfig', newJson);
        
        toast({
          title: "Success",
          description: "Configuration updated and saved successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid JSON format",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        handleJsonUpdate(content);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to read file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={jsonConfig}
        onChange={(e) => setJsonConfig(e.target.value)}
        className="font-mono text-sm h-[300px] bg-gaming-muted border-gaming-accent/20"
      />
      <div className="flex gap-2">
        <Button 
          onClick={() => handleJsonUpdate(jsonConfig)}
          className="flex-1 bg-gaming-accent hover:bg-gaming-accent/80"
        >
          <Save className="w-4 h-4 mr-2" />
          Update Configuration
        </Button>
        <Button
          variant="outline"
          className="bg-gaming-muted hover:bg-gaming-muted/80"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Load JSON
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default JsonConfigPanel;