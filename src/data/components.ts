import { Monitor, Computer, Keyboard, Mouse, Speaker } from 'lucide-react';
import { Component } from '@/types/component';

export const components: Component[] = [
  {
    id: 'monitor',
    name: '27" Gaming Monitor',
    price: 299.99,
    description: '27-inch QHD display with 165Hz refresh rate and 1ms response time',
    icon: Monitor,
  },
  {
    id: 'PC',  // Changed from 'pc' to 'PC' to match configuration
    name: 'Gaming Tower',
    price: 999.99,
    description: 'High-performance gaming PC with RTX 4070 and latest gen processor',
    icon: Computer,
  },
  {
    id: 'keyboard',
    name: 'Mechanical Keyboard',
    price: 149.99,
    description: 'RGB mechanical keyboard with Cherry MX switches',
    icon: Keyboard,
  },
  {
    id: 'mouse',
    name: 'Gaming Mouse',
    price: 79.99,
    description: '16000 DPI gaming mouse with programmable buttons',
    icon: Mouse,
  },
  {
    id: 'speakers',
    name: '2.1 Speaker System',
    price: 199.99,
    description: 'Premium 2.1 speaker system with powerful subwoofer',
    icon: Speaker,
  },
];