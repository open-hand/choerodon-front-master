import React from 'react';
import { useInject } from '@/hooks';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  HeaderIndexProps,
} from './interface';
import './index.less';

const HeaderIndex = (props: HeaderIndexProps) => {
  const [list]: any[] = useInject({
    idList: ['master-global:header'],
  });

  const defaultResult = (
    <StoreProvider {...props}>
      <Content />
    </StoreProvider>
  );

  if (list?.['master-global:header']) {
    const {
      display,
    } = list['master-global:header'];
    if (display) {
      return defaultResult;
    }
    return null;
  }
  return defaultResult;
};

export default HeaderIndex;
