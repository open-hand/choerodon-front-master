import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import { Icon, Dropdown, Menu } from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';
import { Placements } from 'choerodon-ui/pro/lib/dropdown/enum';
import { mount } from '@choerodon/inject';
import { DEFAULT_URL, EXTERNAL_LINK, SAAS_FEEDBACK } from './CONSTANTS';

export type QuestionsBtnProps = {

}

const prefixCls = 'c7ncd-questions-btn';
const intlPrefix = 'c7ncd.questions.btn';

const QuestionsBtn:FC<QuestionsBtnProps> = (props:any) => {
  const {
    AppState: {
      getDocUrl,
    },
  } = props;

  const [url, text, icon] = EXTERNAL_LINK?.split(',') || [];

  const saasFeedbackItem = (
    <Menu.Item>
      {mount('base-pro:saasFeebackBtn', {})}
    </Menu.Item>
  );

  const docItem = (
    <Menu.Item>
      <div
        role="none"
        onClick={() => {
          window.open(getDocUrl?.status ? DEFAULT_URL : getDocUrl);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Icon type="collections_bookmark-o" />
        <span>
          {text}
        </span>
      </div>
    </Menu.Item>
  );

  const itemsGroup = [
    EXTERNAL_LINK && docItem,
    SAAS_FEEDBACK && saasFeedbackItem,
  ].filter(Boolean);

  const renderMenus = () => (
    <Menu>
      {
        itemsGroup
      }
    </Menu>
  );

  return (
    <Dropdown
      overlay={renderMenus()}
      trigger={['click'] as any}
      placement={'bottomCenter' as Placements}
    >
      <Icon type="help_outline" className={prefixCls} />
    </Dropdown>
  );
};

export default inject('AppState')(observer(QuestionsBtn));
