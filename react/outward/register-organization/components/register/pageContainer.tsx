import React from 'react';
import { Icon } from 'choerodon-ui/pro';
import { useStore } from '../../stores';
import listData from '../../assets/listData';
import LogoContainer from './logoContainer';
import './index.less';

export interface IProps {

}

const Index: React.FC<IProps> = (props) => {
  const { children } = props;

  const {
    intlPrefix, prefixCls,
  } = useStore();

  return (
    <div className={`${prefixCls}`}>
      <LogoContainer />
      <header className={`${prefixCls}-container-section1`}>
        <h2>一分钟快速填写，预约DEMO体验！</h2>
        <h3>进度可视、协作顺，高效管理企业研发和项目，</h3>
        <h3>猪齿鱼提供协作、测试、DevOps及容器工具，助力团队效能更快更强更稳定。</h3>
      </header>

      <div className={`${prefixCls}-container-section2`}>
        <div className={`${prefixCls}-container-section2-list-container`}>
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

      <footer className={`${prefixCls}-container-section3`}>
        <div className="text-container1">
          <span className="text">您也可以通过以下方式直接联系我们：</span>
        </div>
        <div className="text-container2">
          <span className="text-container2-inline-block-1">
            <Icon type="local_phone-o" />
            <span>400-800-2077</span>
          </span>
          <span className="text-container2-inline-block-2">
            <span>
              <Icon type="email-o" />
              <span>marketing@zknow.com</span>
            </span>
          </span>
        </div>
      </footer>

      <div className={`${prefixCls}-section-children`}>
        {children}
      </div>

    </div>
  );
};

export default Index;
