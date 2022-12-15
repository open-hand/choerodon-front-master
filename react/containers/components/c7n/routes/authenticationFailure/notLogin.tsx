import React from 'react';
import { observer } from 'mobx-react-lite';
import bg from './assets/bg.svg';
import './index.less';

interface IProps {

}

const Index:React.FC<IProps> = (props) => {
  const prefixCls = 'c7ncd-authenticationFailure-page';
  return (
    <div className={`${prefixCls}-content`}>
      <div className={`${prefixCls}-content-container`}>
        <img src={bg} alt="" />
        <p>无法登录，请返回至上海电气进行登录</p>
      </div>
    </div>
  );
};

export default observer(Index);
