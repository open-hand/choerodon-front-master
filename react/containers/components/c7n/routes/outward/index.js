import React from 'react';
import Outward from './Outward';
import PermissionProvider from '../../tools/permission/PermissionProvider';
import { WEBSOCKET_SERVER } from '../../../../common';
import WSProvider from '../../tools/ws/WSProvider';

const PermissionAndWSProviderIndex = ({ AutoRouter }) => (
  <PermissionProvider>
    <WSProvider server={WEBSOCKET_SERVER}>
      <Outward AutoRouter={AutoRouter} />
    </WSProvider>
  </PermissionProvider>
);

export default PermissionAndWSProviderIndex;
