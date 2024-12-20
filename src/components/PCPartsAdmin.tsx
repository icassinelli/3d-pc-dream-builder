import { useState, useEffect } from 'react';
import { ConfigData } from '@/types/config';
import PartList from './admin/PartList';
import AdvancedTools from './admin/AdvancedTools';
import { defaultConfig } from './admin/DefaultConfig';

interface PCPartsAdminProps {
  availableMeshes: string[];
}

const PCPartsAdmin = ({ availableMeshes }: PCPartsAdminProps) => {
  const [config, setConfig] = useState<ConfigData>(() => {
    const savedConfig = localStorage.getItem('pcConfig');
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (error) {
        console.error('Failed to parse saved config:', error);
        return defaultConfig;
      }
    }
    return defaultConfig;
  });
  
  const [jsonConfig, setJsonConfig] = useState(() => JSON.stringify(config, null, 2));
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pcConfig' && e.newValue) {
        try {
          const newConfig = JSON.parse(e.newValue);
          setConfig(newConfig);
          setJsonConfig(JSON.stringify(newConfig, null, 2));
        } catch (error) {
          console.error('Failed to parse config from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6 p-6 bg-gaming-background text-gaming-text">
      <div className="space-y-3">
        <PartList
          config={config}
          setConfig={setConfig}
          setJsonConfig={setJsonConfig}
          expandedSection={expandedSection}
          toggleSection={toggleSection}
          availableMeshes={availableMeshes}
        />
        <AdvancedTools
          showAdvancedTools={showAdvancedTools}
          setShowAdvancedTools={setShowAdvancedTools}
          expandedSection={expandedSection}
          toggleSection={toggleSection}
          config={config}
          jsonConfig={jsonConfig}
          setJsonConfig={setJsonConfig}
          setConfig={setConfig}
        />
      </div>
    </div>
  );
};

export default PCPartsAdmin;