import { useState } from 'react';
import { Check } from 'lucide-react';

interface Component {
  id: string;
  name: string;
  price: number;
  meshNames: string[];
}

const components: Component[] = [
  {
    id: 'monitor',
    name: '27" Gaming Monitor',
    price: 299.99,
    meshNames: ['monitor_base', 'monitor_screen'],
  },
  {
    id: 'tower',
    name: 'Gaming Tower',
    price: 999.99,
    meshNames: ['tower_case', 'tower_front'],
  },
  {
    id: 'keyboard',
    name: 'Mechanical Keyboard',
    price: 149.99,
    meshNames: ['keyboard'],
  },
  {
    id: 'mouse',
    name: 'Gaming Mouse',
    price: 79.99,
    meshNames: ['mouse'],
  },
  {
    id: 'speakers',
    name: '2.1 Speaker System',
    price: 199.99,
    meshNames: ['speaker_left', 'speaker_right', 'speaker_sub'],
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

  return (
    <div className="w-80 bg-gaming-muted p-6 h-full overflow-auto">
      <h2 className="text-2xl font-bold text-gaming-text mb-6">
        Customize Your Setup
      </h2>
      
      <div className="space-y-4">
        {components.map((component) => (
          <button
            key={component.id}
            onClick={() => toggleComponent(component)}
            className={`w-full p-4 rounded-lg transition-all ${
              selectedComponents.has(component.id)
                ? 'bg-gaming-accent text-white'
                : 'bg-gaming-background text-gaming-text hover:bg-gaming-accent/10'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{component.name}</span>
              <div className="flex items-center space-x-2">
                <span>${component.price}</span>
                {selectedComponents.has(component.id) && (
                  <Check className="w-4 h-4" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-gaming-accent/20">
        <div className="flex justify-between text-gaming-text">
          <span className="font-bold">Total:</span>
          <span className="text-gaming-accent">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComponentSidebar;