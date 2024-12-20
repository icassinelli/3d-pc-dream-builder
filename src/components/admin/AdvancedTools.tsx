import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import ConfigurationPanel from '../ConfigurationPanel';
import JsonConfigPanel from '../JsonConfigPanel';
import { ConfigData } from '@/types/config';

interface AdvancedToolsProps {
  showAdvancedTools: boolean;
  setShowAdvancedTools: (show: boolean) => void;
  expandedSection: string | null;
  toggleSection: (section: string) => void;
  config: ConfigData;
  jsonConfig: string;
  setJsonConfig: (value: string) => void;
  setConfig: (config: ConfigData) => void;
}

const AdvancedTools = ({
  showAdvancedTools,
  setShowAdvancedTools,
  expandedSection,
  toggleSection,
  config,
  jsonConfig,
  setJsonConfig,
  setConfig
}: AdvancedToolsProps) => {
  return (
    <>
      <Button
        variant="outline"
        className="w-full mt-4 bg-[#1A1F2C] border-gaming-accent/30 text-gaming-accent hover:bg-[#1F242F] hover:border-gaming-accent/50"
        onClick={() => setShowAdvancedTools(!showAdvancedTools)}
      >
        <Settings2 className="w-4 h-4 mr-2" />
        Advanced Tools
      </Button>
      {showAdvancedTools && (
        <div className="space-y-3 animate-part-in">
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
    </>
  );
};

export default AdvancedTools;