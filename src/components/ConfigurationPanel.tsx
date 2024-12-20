import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw } from 'lucide-react';
import PCViewer from './PCViewer';
import { toast } from '@/hooks/use-toast';

interface ConfigurationPanelProps {
  visibleParts: string[];
}

const ConfigurationPanel = ({ visibleParts }: ConfigurationPanelProps) => {
  const resetView = () => {
    toast({
      title: "Info",
      description: "View reset to default position",
    });
  };

  const setCurrentView = () => {
    toast({
      title: "Success",
      description: "Current view saved as screenshot location",
    });
  };

  return (
    <div className="space-y-4">
      <div className="aspect-video relative rounded-lg overflow-hidden bg-gaming-muted">
        <PCViewer visibleParts={visibleParts} />
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
  );
};

export default ConfigurationPanel;