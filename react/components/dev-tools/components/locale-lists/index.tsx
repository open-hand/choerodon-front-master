import React from 'react';
import { Alert } from 'choerodon-ui';
import CNLists from './cnLists';
import ENLists from './enLists';
import './index.less';
import { link } from './CONSTANTS';

const prefixCls = 'c7ncd-dev-tool-localeLists';

const LocaleLists = () => {
  const renderContent = () => (
    <div className={`${prefixCls}-container`}>
      <CNLists />
      <ENLists />
    </div>
  );

  return (
    <div className={prefixCls}>
      <Alert message="使用useFormatCommon hook来使用公共多语言，不需要再手动传boot值" showIcon />
      {renderContent()}
      <a href={link} target="_blank" rel="noreferrer">多语言改动文档</a>
    </div>
  );
};

export default LocaleLists;
