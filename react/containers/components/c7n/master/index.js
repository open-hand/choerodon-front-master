import React from 'react';
import { WEBSOCKET_SERVER } from '@/utils';
import Master from './Master';
import PermissionProvider from '../tools/permission/PermissionProvider';
import WSProvider from '../tools/ws/WSProvider';
import './index.less';

const PermissionAndWSProviderIndex = ({ AutoRouter }) => (
  <PermissionProvider>
    <WSProvider server={WEBSOCKET_SERVER}>
      <Master AutoRouter={AutoRouter} />
    </WSProvider>
  </PermissionProvider>
);

export default PermissionAndWSProviderIndex;
