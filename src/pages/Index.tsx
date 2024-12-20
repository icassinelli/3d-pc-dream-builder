import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PCViewer from '@/components/PCViewer';
import ComponentSidebar from '@/components/ComponentSidebar';

const Index = () => {
  const [visibleParts, setVisibleParts] = useState<string[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
  const [availableMeshes, setAvailableMeshes] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === 'a') {
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleComponentToggle = (meshNames: string[]) => {
    setVisibleParts((current) => {
      const newParts = new Set(current);
      meshNames.forEach(name => {
        if (current.includes(name)) {
          newParts.delete(name);
        } else {
          newParts.add(name);
        }
      });
      return Array.from(newParts);
    });
  };

  const handleMeshesLoaded = (meshNames: string[]) => {
    setAvailableMeshes(meshNames);
  };

  return (
    <div className="flex h-screen bg-gaming-background">
      <div className="flex-1 relative">
        <PCViewer 
          visibleParts={visibleParts} 
          onMeshesLoaded={handleMeshesLoaded}
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