import { ConfigData } from '@/types/config';

export const defaultConfig: ConfigData = {
  meshMap: {
    "Monitor": [],
    "PC": [],
    "Keyboard": [],
    "Mouse": [],
    "Speakers": [],
    "NonConfigurable": []
  },
  partDetails: {
    "Monitor": {
      name: '27" Gaming Monitor',
      price: 299.99,
      description: "1440p 165Hz Display",
      isConfigurable: true
    },
    "PC": {
      name: "Gaming Tower",
      price: 1499.99,
      description: "RTX 4070, i7, 32GB RAM",
      isConfigurable: true
    },
    "Keyboard": {
      name: "Mechanical Keyboard",
      price: 149.99,
      description: "RGB Mechanical Switches",
      isConfigurable: true
    },
    "Mouse": {
      name: "Gaming Mouse",
      price: 79.99,
      description: "16000 DPI Optical Sensor",
      isConfigurable: true
    },
    "Speakers": {
      name: "2.1 Speaker System",
      price: 199.99,
      description: "THX Certified Audio",
      isConfigurable: true
    },
    "NonConfigurable": {
      name: "Non-Configurable Items",
      price: 0,
      description: "Items that are always visible",
      isConfigurable: false
    }
  }
};