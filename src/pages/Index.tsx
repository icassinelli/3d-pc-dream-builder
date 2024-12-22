import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PCViewer from '@/components/PCViewer';
import ComponentSidebar from '@/components/ComponentSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ConfigData } from '@/types/config';
import { MeshVisibilityProvider } from '@/contexts/MeshVisibilityContext';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
  const [visibleParts, setVisibleParts] = useState<string[]>([]);
  const [config, setConfig] = useState<ConfigData | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Load config from localStorage and initialize selected components
  useEffect(() => {
    const loadConfig = () => {
      const savedConfig = localStorage.getItem('pcConfig');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          console.log('Loaded config:', parsedConfig);
          setConfig(parsedConfig);
          
          // Initialize selected components with all configurable parts
          const configurableParts = Object.entries(parsedConfig.partDetails)
            .filter(([_, details]) => details.isConfigurable)
            .map(([key]) => key.toLowerCase());
          setSelectedComponents(new Set(configurableParts));
        } catch (error) {
          console.error('Error parsing config:', error);
          toast({
            title: "Error",
            description: "Failed to load configuration",
            variant: "destructive",
          });
        }
      }
    };

    loadConfig();

    // Listen for changes in other tabs/windows
    window.addEventListener('storage', (e) => {
      if (e.key === 'pcConfig') {
        loadConfig();
      }
    });

    return () => {
      window.removeEventListener('storage', loadConfig);
    };
  }, []);

  // Update visible meshes when components or config changes
  useEffect(() => {
    if (!config) return;

    const newVisibleParts: string[] = [];
    
    // Always show non-configurable parts
    if (config.meshMap.NonConfigurable) {
      newVisibleParts.push(...config.meshMap.NonConfigurable);
    }

    // Add meshes for selected components
    selectedComponents.forEach(componentId => {
      const configKey = componentId.charAt(0).toUpperCase() + componentId.slice(1);
      if (config.meshMap[configKey]) {
        newVisibleParts.push(...config.meshMap[configKey]);
      }
    });

    console.log('Updated visible parts:', newVisibleParts);
    setVisibleParts(newVisibleParts);
  }, [selectedComponents, config]);

  const handleComponentToggle = (componentId: string) => {
    console.log('Toggling component:', componentId);
    setSelectedComponents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(componentId)) {
        newSet.delete(componentId);
      } else {
        newSet.add(componentId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === 'a') {
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <MeshVisibilityProvider>
      <div className={`bg-gaming-background ${isMobile ? 'flex flex-col' : 'flex'}`}>
        <div className={`${isMobile ? 'h-[60vh]' : 'flex-1'} relative`}>
          <PCViewer visibleParts={visibleParts} />
        </div>
        {config && (
          <ComponentSidebar
            onComponentToggle={handleComponentToggle}
            selectedComponents={selectedComponents}
            setSelectedComponents={setSelectedComponents}
            config={config}
          />
        )}
      </div>
    </MeshVisibilityProvider>
  );
};

export default Index;