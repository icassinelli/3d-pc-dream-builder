import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PCViewer from '@/components/PCViewer';
import ComponentSidebar from '@/components/ComponentSidebar';

const Index = () => {
  const [visibleParts, setVisibleParts] = useState<string[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
  const [availableMeshes, setAvailableMeshes] = useState<string[]>([]);
  const navigate = useNavigate();

  // Load the configuration from localStorage or use default
  useEffect(() => {
    const savedConfig = localStorage.getItem('pcConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      // Show all meshes by default
      const allMeshes = Object.values(config.meshMap).flat();
      setVisibleParts(allMeshes);
      // Mark all configurable components as selected
      setSelectedComponents(new Set(Object.keys(config.meshMap).filter(
        key => config.partDetails[key]?.isConfigurable
      )));
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

  const handleComponentToggle = (componentName: string) => {
    setSelectedComponents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(componentName)) {
        newSet.delete(componentName);
      } else {
        newSet.add(componentName);
      }
      
      // Update visible parts based on selected components
      const savedConfig = localStorage.getItem('pcConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        const newVisibleParts = Array.from(newSet).flatMap(
          comp => config.meshMap[comp] || []
        );
        // Always show non-configurable parts
        const nonConfigurableParts = config.meshMap.NonConfigurable || [];
        setVisibleParts([...newVisibleParts, ...nonConfigurableParts]);
      }
      
      return newSet;
    });
  };

  return (
    <div className="flex h-screen bg-gaming-background">
      <div className="flex-1 relative">
        <PCViewer 
          visibleParts={visibleParts} 
          onMeshesLoaded={setAvailableMeshes}
        />
      </div>
      <ComponentSidebar
        onComponentToggle={handleComponentToggle}
        selectedComponents={selectedComponents}
        setSelectedComponents={setSelectedComponents}
      />
    </div>
  );
};

export default Index;