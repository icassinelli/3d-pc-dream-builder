import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import { components } from '@/data/components';
import ComponentItem from './ComponentItem';
import type { Component } from '@/types/component';

interface ComponentSidebarProps {
  onComponentToggle: (componentId: string) => void;
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
      components.forEach(comp => onComponentToggle(comp.id));
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
    onComponentToggle(component.id);
  };

  const totalPrice = Array.from(selectedComponents).reduce((sum, id) => {
    const component = components.find(c => c.id === id);
    return sum + (component?.price || 0);
  }, 0);

  const selectedCount = selectedComponents.size;

  const captureScene = async () => {
    setIsCapturing(true);
    try {
      const sceneElement = document.querySelector('.w-full.h-full.relative');
      if (!sceneElement) {
        throw new Error('Scene element not found');
      }
      
      const canvas = await html2canvas(sceneElement);
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
      console.error('Capture error:', error);
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
            <ComponentItem
              key={component.id}
              component={component}
              isSelected={selectedComponents.has(component.id)}
              onToggle={toggleComponent}
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