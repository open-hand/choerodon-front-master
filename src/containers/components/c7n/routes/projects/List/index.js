
import React, { lazy, Suspense, useContext } from 'react';
import Store from '../stores';

const lists = {
  table: lazy(() => import('./table')),
  block: lazy(() => import('./block')),
};

export default function ListWrapper() {
  const { showType } = useContext(Store);
  const List = lists[showType];
  return (
    <Suspense fallback={<span />}>
      <List />
    </Suspense>
  );
}
