import React, { lazy, Suspense, useContext, useState } from 'react';
import { Steps } from 'choerodon-ui';
import { Button } from 'choerodon-ui/pro';

const { Step } = Steps;

const tabs = {
  0: lazy(() => import('./steps/createType')),
  1: lazy(() => import('./steps/ProjectInfo')),
  2: lazy(() => import('./steps/AppInfo')),
  3: lazy(() => import('./steps/ConfirmInfo')),
};

export default function CreateProjectWrap(props) {
  const [index, setIndex] = useState(0);
  const TabBlock = tabs[index];

  function handleCancel() {
    const { handleCancelCreateProject, modal } = props;
    modal.close();
    handleCancelCreateProject();
  }

  function handleGo(next) {
    setIndex(prev => prev + (next ? 1 : -1));
  }

  function renderFooter() {
    return (
      <div style={{ height: '.72rem', borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', marginLeft: '-.24rem', marginRight: '-.24rem', paddingLeft: '.24rem', paddingRight: '.24rem' }}>
        <Button color="blue" funcType="raised">创建</Button>
        <Button color="blue" onClick={() => handleGo(false)}>上一步</Button>
        <Button color="blue" funcType="raised" onClick={() => handleGo(true)}>下一步</Button>
        <Button color="blue" onClick={handleCancel}>取消</Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Steps size="small" current={index}>
        <Step title="创建方式" />
        <Step title="项目信息" />
        <Step title="应用信息" />
        <Step title="确认信息" />
      </Steps>
      <div style={{ flex: 1, marginTop: '.24rem' }}>
        <Suspense fallback={<span />}>
          <TabBlock {...props} />
        </Suspense>
      </div>
      {renderFooter()}
    </div>
  );
}
