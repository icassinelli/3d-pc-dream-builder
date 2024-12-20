import { useState } from 'react';
import { Check, Monitor, Computer, Keyboard, Mouse, Speaker, ShoppingCart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';

interface Component {
  id: string;
  name: string;
  price: number;
  meshNames: string[];
  description: string;
  icon: React.ElementType;
}

const components: Component[] = [
  {
    id: 'monitor',
    name: '27" Gaming Monitor',
    price: 299.99,
    meshNames: ['monitor_base', 'monitor_screen'],
    description: '27-inch QHD display with 165Hz refresh rate and 1ms response time',
    icon: Monitor,
  },
  {
    id: 'tower',
    name: 'Gaming Tower',
    price: 999.99,
    meshNames: ['tower_case', 'tower_front'],
    description: 'High-performance gaming PC with RTX 4070 and latest gen processor',
    icon: Computer,
  },
  {
    id: 'keyboard',
    name: 'Mechanical Keyboard',
    price: 149.99,
    meshNames: ['keyboard'],
    description: 'RGB mechanical keyboard with Cherry MX switches',
    icon: Keyboard,
  },
  {
    id: 'mouse',
    name: 'Gaming Mouse',
    price: 79.99,
    meshNames: ['mouse'],
    description: '16000 DPI gaming mouse with programmable buttons',
    icon: Mouse,
  },
  {
    id: 'speakers',
    name: '2.1 Speaker System',
    price: 199.99,
    meshNames: ['speaker_left', 'speaker_right', 'speaker_sub'],
    description: 'Premium 2.1 speaker system with powerful subwoofer',
    icon: Speaker,
  },
];

interface ComponentSidebarProps {
  onComponentToggle: (meshNames: string[]) => void;
  selectedComponents: Set<string>;
  setSelectedComponents: (components: Set<string>) => void;
}

const ComponentSidebar = ({
  onComponentToggle,
  selectedComponents,
  setSelectedComponents,
}: ComponentSidebarProps) => {
  const { toast } = useToast();
  const [isCapturing, setIsCapturing] = useState(false);

  // Initialize all components as selected by default
  useState(() => {
    if (selectedComponents.size === 0) {
      const allComponents = new Set(components.map(comp => comp.id));
      setSelectedComponents(allComponents);
      // Trigger visibility for all components
      components.forEach(comp => onComponentToggle(comp.meshNames));
    }
  });

  const toggleComponent = (component: Component) => {
    const newSelected = new Set(selectedComponents);
    if (newSelected.has(component.id)) {
      newSelected.delete(component.id);
    } else {
      newSelected.add(component.id);
    }
    setSelectedComponents(newSelected);
    onComponentToggle(component.meshNames);
  };

  const totalPrice = Array.from(selectedComponents).reduce((sum, id) => {
    const component = components.find(c => c.id === id);
    return sum + (component?.price || 0);
  }, 0);

  const selectedCount = selectedComponents.size;

  const captureScene = async () => {
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(document.querySelector('#scene-container') as HTMLElement);
      const image = canvas.toDataURL('image/png');
      
      const cartData = {
        screenshot: image,
        components: Array.from(selectedComponents).map(id => 
          components.find(c => c.id === id)
        ),
        totalPrice,
      };
      localStorage.setItem('pcCart', JSON.stringify(cartData));
      
      toast({
        title: "Added to Cart!",
        description: `Your custom PC setup with ${selectedCount} components has been saved.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to capture your setup. Please try again.",
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
          {components.map((component) => (
            <button
              key={component.id}
              onClick={() => toggleComponent(component)}
              className={`w-full p-4 rounded-lg transition-all ${
                selectedComponents.has(component.id)
                  ? 'bg-gaming-accent/20 text-white'
                  : 'bg-gaming-background text-gaming-text hover:bg-gaming-accent/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <component.icon className="w-5 h-5" />
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{component.name}</span>
                    <span className="text-gaming-accent">${component.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gaming-text/70">
                      {component.description}
                    </p>
                    {selectedComponents.has(component.id) && (
                      <Check className="w-4 h-4 ml-2 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            </button>
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