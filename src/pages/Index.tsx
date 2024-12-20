import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PCViewer from '@/components/PCViewer';
import ComponentSidebar from '@/components/ComponentSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ConfigData } from '@/types/config';
import { MeshVisibilityProvider } from '@/contexts/MeshVisibilityContext';
import { components } from '@/data/components';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(() => 
    new Set(components.map(comp => comp.id))
  );
  const [visibleParts, setVisibleParts] = useState<string[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [config, setConfig] = useState<ConfigData>({
    meshMap: {},
    partDetails: {}
  });

  // Load initial config and handle storage events
  useEffect(() => {
    const loadConfig = () => {
      const savedConfig = localStorage.getItem('pcConfig');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          console.log('Loading config:', parsedConfig);
          setConfig(parsedConfig);
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

    // Load initial config
    loadConfig();

    // Listen for storage events
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'pcConfig' && event.newValue !== null) {
        loadConfig();
        toast({
          title: "Configuration Updated",
          description: "The configuration has been updated",
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); // Remove selectedComponents from dependency array

  // Update visible parts when selected components or config changes
  useEffect(() => {
    console.log('Updating visible parts. Selected components:', Array.from(selectedComponents));
    console.log('Current config:', config);
    
    const newVisibleParts = Array.from(selectedComponents).reduce<string[]>((meshes, componentId) => {
      const componentMeshes = config.meshMap[componentId] || [];
      console.log(`Component ${componentId} meshes:`, componentMeshes);
      return [...meshes, ...componentMeshes];
    }, []);
    
    console.log('New visible parts:', newVisibleParts);
    setVisibleParts(newVisibleParts);
  }, [selectedComponents, config]); // Add config to dependency array

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
        <ComponentSidebar
          onComponentToggle={handleComponentToggle}
          selectedComponents={selectedComponents}
          setSelectedComponents={setSelectedComponents}
        />
      </div>
    </MeshVisibilityProvider>
  );
};

export default Index;