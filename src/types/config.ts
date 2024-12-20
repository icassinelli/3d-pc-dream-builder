export interface PartDetail {
  name: string;
  description: string;
  price: number;
  isConfigurable: boolean;
}

export interface ConfigData {
  meshMap: Record<string, string[]>;
  partDetails: Record<string, PartDetail>;
}