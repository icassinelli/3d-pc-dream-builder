import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PCViewer from '@/components/PCViewer';
import ComponentSidebar from '@/components/ComponentSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
  const [visibleParts, setVisibleParts] = useState<string[]>([]);
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
    // For now, we'll just use the componentId as the part name
    setVisibleParts(Array.from(selectedComponents));
  };

  return (
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
  );
};

export default Index;