//Routing Constants
export const INVENTORY_PATH = '/inventory';
export const CART_CHECKOUT_PATH = '/cart-checkout';
export const CUSTOMERS_PATH = '/customers';
// API Constants
export const BASE_URL = '/api/';
export const PREFIX_URL =
  'https://raw.githubusercontent.com/benoitvallon/100-best-books/master/static/';
export const DRINKS_URL = 'drinks';
export const BOOKS_URL = 'books';
// Modal Type
export enum ModalType {
  ADD_TO_CART = 'ADD_TO_CART',
  EDIT_INVENTORY = 'EDIT_INVENTORY',
  ADD_PRODUCT = 'ADD_PRODUCT',
  DELETE_PRODUCT = 'DELETE_PRODUCT',
}

export enum InventoryType {
  BOOK = 'BOOK',
  DRINK = 'DRINK',
}
