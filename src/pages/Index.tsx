import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PCViewer from '@/components/PCViewer';
import ComponentSidebar from '@/components/ComponentSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ConfigData } from '@/types/config';
import { MeshVisibilityProvider } from '@/contexts/MeshVisibilityContext';

const Index = () => {
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
  const [visibleParts, setVisibleParts] = useState<string[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [config, setConfig] = useState<ConfigData>({
    meshMap: {},
    partDetails: {}
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('pcConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        console.log('Loaded config:', parsedConfig);
      } catch (error) {
        console.error('Error parsing config:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === 'a') {
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    console.log('Selected components changed:', Array.from(selectedComponents));
    
    const visibleMeshes = Array.from(selectedComponents).reduce<string[]>((meshes, componentId) => {
      const componentMeshes = config.meshMap[componentId] || [];
      console.log(`Meshes for ${componentId}:`, componentMeshes);
      return [...meshes, ...componentMeshes];
    }, []);
    
    console.log('Setting visible meshes:', visibleMeshes);
    setVisibleParts(visibleMeshes);
  }, [selectedComponents, config]);

  const handleComponentToggle = (componentId: string) => {
    console.log('Component toggled:', componentId);
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