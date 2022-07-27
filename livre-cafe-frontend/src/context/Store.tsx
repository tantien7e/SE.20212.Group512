import { CustomerInterface, VoucherInterface } from '@app/models';
import { ProductInterface } from '@app/models/product.interface';
import { ReservationPostData } from '@app/models/reservation.interface';
import React, { createContext, useReducer } from 'react';

export interface CartItemInterface extends ProductInterface {
  quantity: number;
  additionalRequirements: string;
  cost: number;
  hasNoStock?: boolean;
}
export interface CartStateInterface {
  cart: {
    cartItems: CartItemInterface[];
  };

  customer?: CustomerInterface;
  reservation?: ReservationPostData;
  vouchers: VoucherInterface[];
}

export enum CartAction {
  CART_ADD_ITEM = 'CART_ADD_ITEM',
  CART_UPDATE_ITEM_QUANTITY = 'CART_UPDATE_ITEM_QUANTITY',
  DELETE_ITEM = 'DELETE_ITEM',
  CART_CLEAR = 'CART_CLEAR',
  SELECT_CUSTOMER = 'SELECT_CUSTOMER',
  REMOVE_CUSTOMER = 'REMOVE_CUSTOMER',
  ADD_VOUCHERS = 'ADD_VOUCHERS',
  REMOVE_VOUCHERS = 'REMOVE_VOUCHERS',
  ADD_RESERVATION = 'ADD_RESERVATION',
  REMOVE_RESERVATION = 'REMOVE_RESERVATION',
  UPDATE_RESERVATION = 'UPDATE_RESERVATION',
}

interface CartContextActionInterface {
  type: string;
  payload: CartItemInterface | CustomerInterface | VoucherInterface[];
}

const initialState: CartStateInterface = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems') || '')
      : [],
  },

  customer: localStorage.getItem('cartCustomer')
    ? JSON.parse(localStorage.getItem('cartCustomer') || '')
    : null,
  vouchers: localStorage.getItem('vouchers')
    ? JSON.parse(localStorage.getItem('vouchers') || '')
    : null,
  reservation: localStorage.getItem('reservation')
    ? JSON.parse(localStorage.getItem('reservation') || '')
    : null,
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
  const selectedItem = action.payload as CartItemInterface;
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
            (selectedItem?.quantity <= selectedItem.stock ||
              selectedItem.hasNoStock)
            ? selectedItem
            : item,
        )
        : [...state.cart.cartItems, action.payload];
      const filteredCartItems = (cartItems as CartItemInterface[]).filter(
        (item) =>
          item.quantity > 0 && (item.quantity <= item.stock || item.hasNoStock),
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
      localStorage.removeItem('cartCustomer');
      localStorage.removeItem('vouchers');
      localStorage.removeItem('reservation');

      return {
        cart: {
          cartItems: [],
        },
        customer: null,
        vouchers: [],
      };
    }

    case CartAction.SELECT_CUSTOMER: {
      const customer = action.payload;
      localStorage.setItem('cartCustomer', JSON.stringify(customer));
      return {
        ...state,
        customer,
      };
    }

    case CartAction.REMOVE_CUSTOMER: {
      localStorage.removeItem('cartCustomer');
      return {
        ...state,
        customer: null,
      };
    }

    case CartAction.ADD_VOUCHERS: {

      const newVouchers = [...action.payload as VoucherInterface[]]
      return {
        ...state,
        vouchers: newVouchers,
      };
    }

    case CartAction.REMOVE_VOUCHERS: {
      localStorage.removeItem('vouchers');
      return {
        ...state,
        vouchers: null,
      };
    }

    case CartAction.ADD_RESERVATION: {
      const reservation = action.payload;
      localStorage.setItem('reservation', JSON.stringify(reservation));
      return {
        ...state,
        reservation,
      };
    }

    case CartAction.REMOVE_RESERVATION: {
      localStorage.removeItem('reservation');
      return {
        ...state,
        reservation: undefined,
      };
    }

    case CartAction.UPDATE_RESERVATION: {
      const newReservation = action.payload;
      localStorage.setItem('reservation', JSON.stringify(newReservation));
      return {
        ...state,
        newReservation,
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
