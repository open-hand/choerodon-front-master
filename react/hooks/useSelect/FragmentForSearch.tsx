import React, { Fragment } from 'react';

interface Props {
  name: string
}
// 使用render自定义option的渲染时，套一个这个组件，用来搜索
const FragmentForSearch: React.FC<Props> = ({ children }) => <Fragment>{children}</Fragment>;

export default FragmentForSearch;
