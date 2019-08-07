import React from 'react';
import Master from './Master';
import PermissionProvider from '../tools/permission/PermissionProvider';
import { WEBSOCKET_SERVER } from '../../../common';
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
