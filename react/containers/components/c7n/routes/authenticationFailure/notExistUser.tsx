import React from 'react';
import { observer } from 'mobx-react-lite';
import bg2 from './assets/bg2.svg';
import './index.less';

interface IProps {

}

const Index:React.FC<IProps> = (props) => {
  const prefixCls = 'c7ncd-authenticationFailure-page';
  return (
    <div className={`${prefixCls}-content`}>
      <div className={`${prefixCls}-content-container`}>
        <img src={bg2} alt="" />
        <p>当前用户不存在猪齿鱼系统。</p>
      </div>
    </div>
  );
};

export default observer(Index);
