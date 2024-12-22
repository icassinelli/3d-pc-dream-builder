import { LucideIcon } from 'lucide-react';

export interface Component {
  id: string;
  name: string;
  price: number;
  description: string;
  icon?: string | LucideIcon;
}