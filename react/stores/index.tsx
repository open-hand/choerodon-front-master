import React, { useContext, createContext, FC } from 'react';
import { C7NContextProps } from './interface';
import useStore from './C7NStore';

const C7NContext = createContext<C7NContextProps>({});

export function useC7NContext() {
  return useContext(C7NContext);
}

export const C7NStoreProvider:FC<any> = (props) => {
  const { children } = props;

  const C7NStore = useStore();

  const value = {
    ...props,
    C7NStore,
  };

  return (
    <C7NContext.Provider value={value}>
      {children}
    </C7NContext.Provider>
  );
};
