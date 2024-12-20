import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PCViewer from '@/components/PCViewer';
import ComponentSidebar from '@/components/ComponentSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === 'a') {
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleComponentToggle = (componentId: string) => {
    // This function will be implemented later when we handle 3D model visibility
    console.log('Component toggled:', componentId);
  };

  return (
    <div className={`bg-gaming-background ${isMobile ? 'flex flex-col' : 'flex'}`}>
      <div className={`${isMobile ? 'h-[60vh]' : 'flex-1'} relative`}>
        <PCViewer />
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
