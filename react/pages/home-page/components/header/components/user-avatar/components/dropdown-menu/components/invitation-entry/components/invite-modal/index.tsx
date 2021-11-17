import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  InviteEntryIndexProps,
} from './interface';
import './index.less';

const InviteEntryIndex = (props: InviteEntryIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default InviteEntryIndex;
