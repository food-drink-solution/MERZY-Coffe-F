export interface CoffeeOrigin {
  id: string;
  country: string;
  region: string;
  bean: string;
  notes: string;
  price: number;
  latitude: number;
  longitude: number;
}

export interface RoastLevel {
  id: number;
  title: string;
  description: string;
  filter: string;
}

export interface BrewMethod {
  id: string;
  name: string;
  grindSize: string;
  ratio: string;
  timing: string;
}

export interface Product {
  id: string;
  name: string;
  roastLevel: RoastLevel;
  description: string;
  image: string;
}
