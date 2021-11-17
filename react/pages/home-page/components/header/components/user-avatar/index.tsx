import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  UserAvatarIndexProps,
} from './interface';
import './index.less';

const UserAvatarIndex = (props: UserAvatarIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default UserAvatarIndex;
