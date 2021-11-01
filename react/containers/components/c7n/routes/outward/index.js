import React from 'react';
import { WEBSOCKET_SERVER } from '@/utils';
import Outward from './Outward';
import { PermissionProvider } from '@/components/permission';
import WSProvider from '@/components/ws/WSProvider';

const PermissionAndWSProviderIndex = ({ AutoRouter }) => (
  <PermissionProvider>
    <WSProvider server={WEBSOCKET_SERVER}>
      <Outward AutoRouter={AutoRouter} />
    </WSProvider>
  </PermissionProvider>
);

export default PermissionAndWSProviderIndex;
