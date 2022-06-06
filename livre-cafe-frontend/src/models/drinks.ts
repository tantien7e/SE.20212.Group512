export interface DrinkInterface {
  imageUrl: string;
  stock: number;
  name: string;
  price: number;
  _id: string;
  // type?: string;
}

export interface DrinkAddAction {
  type: string;
  payload: (data: DrinkInterface) => void;
}

export interface DrinksGetAction {
  type: string;
  payload: () => void;
}
