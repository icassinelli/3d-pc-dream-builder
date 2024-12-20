import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ConfigData } from '@/types/config';

interface JsonConfigPanelProps {
  jsonConfig: string;
  setJsonConfig: (value: string) => void;
  setConfig: (config: ConfigData) => void;
}

const JsonConfigPanel = ({ jsonConfig, setJsonConfig, setConfig }: JsonConfigPanelProps) => {
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

  return (
    <div className="space-y-4">
      <Textarea
        value={jsonConfig}
        onChange={(e) => setJsonConfig(e.target.value)}
        className="font-mono text-sm h-[300px] bg-gaming-muted border-gaming-accent/20"
      />
      <Button 
        onClick={() => handleJsonUpdate(jsonConfig)}
        className="w-full mt-4 bg-gaming-accent hover:bg-gaming-accent/80"
      >
        <Save className="w-4 h-4 mr-2" />
        Update Configuration
      </Button>
    </div>
  );
};

export default JsonConfigPanel;