import React, { createContext, useReducer } from 'react';

interface PathStateInterface {
  activePath: string;
}
interface PathContextActionInterface {
  type: string;
  payload: PathStateInterface;
}

const initialState = {
  activePath: 'inventory',
};

export const Store = createContext<{
  state: PathStateInterface;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: (action: PathContextActionInterface) => {
    return reducer(initialState, action);
  },
});
interface StorePropsInterface {
  children: any;
}

function reducer(
  state: PathStateInterface,
  action: PathContextActionInterface,
) {
  switch (action.type) {
    case 'CHANGE_ACTIVE_PATH': {
      const activePath = action.payload.activePath;
      return {
        activePath,
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
