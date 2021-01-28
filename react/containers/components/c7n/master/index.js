import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { WEBSOCKET_SERVER } from '@/utils';
import Master from './Master';
import PermissionProvider from '../tools/permission/PermissionProvider';
import WSProvider from '../tools/ws/WSProvider';
import './index.less';

const queryClient = new QueryClient();
const PermissionAndWSProviderIndex = ({ AutoRouter }) => (
  <QueryClientProvider client={queryClient}>
    <PermissionProvider>
      <WSProvider server={WEBSOCKET_SERVER}>
        <Master AutoRouter={AutoRouter} />
      </WSProvider>
    </PermissionProvider>
  </QueryClientProvider>
);

export default PermissionAndWSProviderIndex;
