import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import defaultConfigs from './config';

const queryClient = new QueryClient(defaultConfigs);

const C7NReactQueryProvider:React.FC = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

export default C7NReactQueryProvider;
