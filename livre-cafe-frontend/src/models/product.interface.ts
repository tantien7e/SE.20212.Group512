import { AreaInterface } from '@app/models/area.interface';

export interface DrinkInterface {
  imageUrl: string;
  stock: number;
  name: string;
  price: number;
  _id: string;
}

export interface BookInterface {
  author: string;
  country: string;
  imageUrl: string;
  language: string;
  link: string;
  pages: number;
  title: string;
  year: number;
  stock: number;
  price: number;
  _id: string;
}
export interface SnackInterface {
  imageUrl: string;
  name: string;
  price: number;
  _id: string;
  stock?: number;
}

export type ProductInterface = DrinkInterface & BookInterface & SnackInterface;
