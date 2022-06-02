export const INVENTORY_PATH = '/inventory';
export const CART_CHECKOUT_PATH = '/cart-checkout';
export const CUSTOMERS_PATH = '/customers';
export const BASE_URL = '/api/';
export const PREFIX_URL =
  'https://raw.githubusercontent.com/benoitvallon/100-best-books/master/static/';

// Modal Type
export enum ModalType {
  ADD_TO_CART = 'ADD_TO_CART',
  EDIT_INVENTORY = 'EDIT_INVENTORY',
  ADD_PRODUCT = 'ADD_PRODUCT',
}

export enum InventoryType {
  BOOK = 'BOOK',
  DRINK = 'DRINK',
}
