export interface PartDetail {
  name: string;
  description: string;
  price: number;
  isConfigurable: boolean;
  icon?: string;
}

export interface ConfigData {
  meshMap: Record<string, string[]>;
  partDetails: Record<string, PartDetail>;
}