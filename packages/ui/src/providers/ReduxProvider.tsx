'use client';

import React from 'react';
import { Provider } from 'react-redux';

import { store } from '../store/store';
import { CrossAppSyncProvider } from '../components/CrossAppSyncProvider';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <CrossAppSyncProvider>
        {children}
      </CrossAppSyncProvider>
    </Provider>
  );
};