import { Check } from 'lucide-react';
import { Component } from '@/types/component';

interface ComponentItemProps {
  component: Component;
  isSelected: boolean;
  onToggle: (component: Component) => void;
}

const ComponentItem = ({ component, isSelected, onToggle }: ComponentItemProps) => {
  return (
    <button
      onClick={() => onToggle(component)}
      className={`w-full p-4 rounded-lg transition-all ${
        isSelected
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
            {isSelected && (
              <Check className="w-4 h-4 ml-2 flex-shrink-0" />
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ComponentItem;