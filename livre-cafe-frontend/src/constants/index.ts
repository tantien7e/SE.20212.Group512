//Routing Constants
export const INVENTORY_PATH = '/inventory';
export const CART_CHECKOUT_PATH = '/cart-checkout';
export const CUSTOMERS_PATH = '/customers';
// API Constants
export const BASE_URL = '/api/';
export const BASE_URL_MOCK = '/api-mock/';

export const PREFIX_URL =
  'https://raw.githubusercontent.com/benoitvallon/100-best-books/master/static/';
export const DRINKS_URL = 'drinks';
export const BOOKS_URL = 'books';
export const CUSTOMERS_URL = 'customers';
export const ORDERS_URL = 'orders';

// Modal Type
export enum ModalType {
  ADD_TO_CART = 'ADD_TO_CART',
  EDIT_INVENTORY = 'EDIT_INVENTORY',
  ADD_PRODUCT = 'ADD_PRODUCT',
  DELETE_PRODUCT = 'DELETE_PRODUCT',
  ADD_CUSTOMER = 'ADD_CUSTOMER',
  EDIT_CUSTOMER = 'EDIT_CUSTOMER',
  DELETE_CUSTOMER = 'DELETE_CUSTOMER',
  VIEW_CUSTOMER = 'VIEW_CUSTOMER',
}

export enum InventoryType {
  BOOK = 'BOOK',
  DRINK = 'DRINK',
}
