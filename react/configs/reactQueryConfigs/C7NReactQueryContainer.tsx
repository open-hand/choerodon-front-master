import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { c7nReactQueryClientConfig, c7nReactQueryDevtoolsConfig } from './config';
import './index.less';

const queryClient = new QueryClient(c7nReactQueryClientConfig);

const C7NReactQueryProvider:React.FC = ({ children }) => (
  <QueryClientProvider client={queryClient} contextSharing>
    {children}
    {/* react-query的devtool，仅存在dev 环境下，方便开发 */}
    <ReactQueryDevtools {...c7nReactQueryDevtoolsConfig} />
  </QueryClientProvider>
);

export default C7NReactQueryProvider;
