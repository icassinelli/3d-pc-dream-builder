import { useState } from 'react';
import PCViewer from '@/components/PCViewer';
import ComponentSidebar from '@/components/ComponentSidebar';

const Index = () => {
  const [visibleParts, setVisibleParts] = useState<string[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());

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

  return (
    <div className="flex h-screen bg-gaming-background">
      <div className="flex-1 relative">
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