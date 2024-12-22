import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import ComponentItem from './ComponentItem';
import { ConfigData } from '@/types/config';

interface ComponentSidebarProps {
  onComponentToggle: (componentId: string) => void;
  selectedComponents: Set<string>;
  setSelectedComponents: (components: Set<string>) => void;
  config: ConfigData;
}

const ComponentSidebar = ({
  onComponentToggle,
  selectedComponents,
  setSelectedComponents,
  config,
}: ComponentSidebarProps) => {
  const navigate = useNavigate();
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();

  const configurableComponents = Object.entries(config.partDetails)
    .filter(([_, details]) => details.isConfigurable)
    .map(([key, details]) => ({
      id: key.toLowerCase(),
      name: details.name,
      price: details.price,
      description: details.description,
      icon: details.icon || 'settings'
    }));

  const totalPrice = Array.from(selectedComponents).reduce((sum, id) => {
    const component = configurableComponents.find(c => c.id === id);
    return sum + (component?.price || 0);
  }, 0);

  const selectedCount = selectedComponents.size;

  const captureScene = async () => {
    setIsCapturing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const sceneElement = 
        document.querySelector('.w-full.h-full.relative') || 
        document.querySelector('.w-full.h-full') ||
        document.querySelector('[ref="mountRef"]');

      if (!sceneElement) {
        console.error('Available elements:', document.body.innerHTML);
        throw new Error('Scene element not found. Please ensure the 3D viewer is properly mounted.');
      }
      
      const canvas = await html2canvas(sceneElement as HTMLElement, {
        useCORS: true,
        backgroundColor: '#1a1a1a',
        scale: 2,
        logging: true,
        allowTaint: true,
        foreignObjectRendering: true
      });
      
      const image = canvas.toDataURL('image/png');
      
      const cartData = {
        screenshot: image,
        components: Array.from(selectedComponents).map(id => 
          configurableComponents.find(c => c.id === id)
        ),
        totalPrice,
      };
      
      localStorage.setItem('pcCart', JSON.stringify(cartData));
      navigate('/cart');
    } catch (error) {
      console.error('Capture error:', error);
      toast({
        title: "Error",
        description: "Failed to capture scene. Please try again.",
        variant: "destructive",
      });
    }
    setIsCapturing(false);
  };

  return (
    <div className="w-[405px] bg-gaming-muted p-6 h-full overflow-auto flex flex-col">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gaming-text mb-2">
          Customize Your Gaming PC
        </h2>
        <p className="text-sm text-gaming-text/70 mb-6">
          Add accessories to complete your setup
        </p>
        
        <div className="text-sm font-medium text-gaming-accent mb-4">
          AVAILABLE COMPONENTS
        </div>
        
        <div className="space-y-2">
          {configurableComponents.map((component) => (
            <ComponentItem
              key={component.id}
              component={component}
              isSelected={selectedComponents.has(component.id)}
              onToggle={() => onComponentToggle(component.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gaming-accent/20">
        <div className="flex justify-between text-sm text-gaming-text/70 mb-2">
          <span>Selected Items:</span>
          <span>{selectedCount}</span>
        </div>
        <div className="flex justify-between text-gaming-text mb-4">
          <span className="font-bold">Total Price:</span>
          <span className="text-gaming-accent font-bold">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
        
        <button
          onClick={captureScene}
          disabled={selectedCount === 0 || isCapturing}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 bg-gaming-accent text-white font-medium transition-all
            ${selectedCount === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gaming-accent/90'}
            ${isCapturing ? 'animate-pulse' : ''}`}
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ComponentSidebar;