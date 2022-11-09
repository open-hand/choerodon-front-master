import React from 'react';
import { Icon } from 'choerodon-ui/pro';
import { useStore } from '../../stores';
import listData from '../../assets/listData';
import LogoContainer from '../register/logoContainer';
import './index.less';

interface IProps {

}

const Index:React.FC<IProps> = (props) => {
  const { children } = props;
  const {
    intlPrefix, prefixCls,
  } = useStore();
  const pagePrefixCls = `${prefixCls}-compelete-info`;

  return (
    <div className={`${pagePrefixCls}`}>
      <LogoContainer />
      <div className={`${pagePrefixCls}-left`}>
        <div className={`${pagePrefixCls}-left-list-container`}>
          {
            listData.map((item) => (
              <div key={item.id} className="list-item">
                <Icon type="check_circle" />
                <span className="text">{item.text}</span>
              </div>
            ))
          }
        </div>
        <div className="bg-container" />

      </div>
      <div className={`${pagePrefixCls}-right`}>
        <div className={`${pagePrefixCls}-right-section-children`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Index;
