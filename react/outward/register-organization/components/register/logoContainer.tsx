import React from 'react';
import logo from '../../assets/logo.svg';
import { useStore } from '../../stores';

interface IProps {

}

const Index:React.FC<IProps> = (props) => {
  const {
    prefixCls,
  } = useStore();

  const handleLogoClick = (url:string) => {
    window.open(url);
  };

  return (
    <div className={`${prefixCls}-container-logo`}>
      <img src={logo} alt="" />
      <div className="hide-layer-left" role="none" onClick={() => { handleLogoClick('https://www.zknow.com/'); }} />
      <div className="hide-layer-right" role="none" onClick={() => { handleLogoClick('https://www.zknow.com/choerodon/'); }} />
    </div>
  );
};

export default Index;
