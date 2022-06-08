import { ProductInterface } from '@app/models/product.interface';
import { toastInformSuccess } from '@app/utils/toast';
import React, { createContext, useReducer } from 'react';

export interface CartItemInterface extends ProductInterface {
  quantity: number;
  additionalRequirement?: string;
}
export interface CartStateInterface {
  cart: {
    cartItems: CartItemInterface[];
  };
}

export enum CartAction {
  CART_ADD_ITEM = 'CART_ADD_ITEM',
  CART_UPDATE_ITEM_QUANTITY = 'CART_UPDATE_ITEM_QUANTITY',
  DELETE_ITEM = 'DELETE_ITEM',
  CART_CLEAR = 'CART_CLEAR',
}

interface CartContextActionInterface {
  type: string;
  payload: CartItemInterface;
}

const initialState: CartStateInterface = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems') || '')
      : [],
  },
};

export const Store = createContext<{
  state: CartStateInterface;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: (action: CartContextActionInterface) => {
    return reducer(initialState, action);
  },
});
interface StorePropsInterface {
  children: any;
}

function reducer(
  state: CartStateInterface,
  action: CartContextActionInterface,
) {
  const selectedItem = action.payload;
  const existItem = state.cart?.cartItems?.find(
    (item: ProductInterface) => item?._id === selectedItem?._id,
  );

  switch (action.type) {
    case CartAction.CART_ADD_ITEM: {
      const cartItems = existItem
        ? state.cart?.cartItems?.map((item) =>
            item._id === existItem._id ? selectedItem : item,
          )
        : [...state.cart.cartItems, action.payload];
      return {
        ...state,
        cart: {
          cartItems,
        },
      };
    }
    case CartAction.CART_UPDATE_ITEM_QUANTITY: {
      const cartItems = existItem
        ? state.cart?.cartItems?.map((item) =>
            item._id === existItem._id &&
            selectedItem?.quantity <= selectedItem.stock
              ? selectedItem
              : item,
          )
        : [...state.cart.cartItems, action.payload];
      const filteredCartItems = cartItems.filter(
        (item) => item.quantity > 0 && item.quantity <= item.stock,
      );
      localStorage.setItem('cartItems', JSON.stringify(filteredCartItems));
      return {
        ...state,
        cart: {
          cartItems: filteredCartItems,
        },
      };
    }
    case CartAction.DELETE_ITEM: {
      const afterDeletedItems = state.cart?.cartItems?.filter((item) => {
        return item._id !== selectedItem._id;
      });

      localStorage.setItem('cartItems', JSON.stringify(afterDeletedItems));
      return {
        ...state,
        cart: {
          cartItems: afterDeletedItems,
        },
      };
    }

    case CartAction.CART_CLEAR: {
      localStorage.removeItem('cartItems');
      return {
        cart: {
          cartItems: [],
        },
      };
    }
    default:
      return state;
  }
}

export function StoreProvider(props: StorePropsInterface) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
