/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Popover } from 'choerodon-ui';

import popoverHead from '@/assets/images/popoverHead.png';
import useStore, { whithStoreProvider } from './store';
import { GuideVO } from './model';
import Layout from '../Layout';
import styles from './index.less';

const classNamePrefix = 'c7n-card-guide';

const guidePopover = (guideContent: GuideVO) => (
  <div className="c7ncd-guide-popover">
    <div className="c7ncd-guide-popover-head">
      <span style={{
        width: '43%', display: 'inline-block', position: 'relative', zIndex: 1,
      }}
      >
        { guideContent?.title ?? '平台指引'}
      </span>
      <img src={popoverHead} alt="" />
    </div>
    <div className="c7ncd-guide-popover-content">
      {
        guideContent?.userGuideStepVOList?.map?.((item) => (
          <div className="c7ncd-guide-popover-content-item" key={item.stepName}>
            <div className="c7ncd-guide-popover-content-item-left">
              <p className="c7ncd-guide-popover-content-item-left-stepName">{item.stepName}</p>
              <p className="c7ncd-guide-popover-content-item-left-description">
                {item.description}
                <span
                  onClick={() => {
                    window.open(item.docUrl);
                  }}
                >
                  指引文档
                </span>
              </p>
            </div>
          </div>
        ))
        }
    </div>
  </div>
);

function BeginnerGuide() {
  const { guides } = useStore();

  const renderGuide = (item:GuideVO) => (
    <li className={styles[`${classNamePrefix}-li`]} key={item.id}>
      <Popover
        content={guidePopover(item)}
        trigger="click"
        placement="topLeft"
        overlayClassName="c7ncd-guide-origin"
      >
        <span className={styles[`${classNamePrefix}-title`]}>{item.title}</span>
      </Popover>
    </li>
  );

  return (
    <Layout title="新手入门" className={styles[classNamePrefix]}>
      <ul className={styles[`${classNamePrefix}-ul`]}>
        {guides.map(renderGuide)}
      </ul>
    </Layout>
  );
}

export default whithStoreProvider(BeginnerGuide);
