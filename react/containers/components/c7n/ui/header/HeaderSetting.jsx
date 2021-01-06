import React from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { Button as ProButton } from 'choerodon-ui/pro';
import { Button, Icon } from 'choerodon-ui';
import classNames from 'classnames';
import getSearchString from '../../util/gotoSome';

const iconStyle = { marginLeft: 0, marginRight: 0 };

const Setting = ({
  AppState, HeaderStore, MenuStore, history, ...props
}) => {
  const theme = AppState.getCurrentTheme;
  const LI_MAPPING = [
    { title: '工作台', icon: theme === 'theme4' ? 'home-o' : 'home', activePath: '/workbench' },
    // { title: '协作共享', icon: 'question_answer', activePath: '/buzz/cooperate', exclude: '/buzz/cooperate-pro' },
    { title: '项目', icon: theme === 'theme4' ? 'project_line' : 'project_filled', activePath: '/projects' },
    // { title: '项目', icon: 'project_filled', activePath: '/projectsPro' },
    // { title: '应用', icon: 'widgets', activePath: '/applications' },
    { title: '知识库', icon: theme === 'theme4' ? 'chrome_reader_mode-o' : 'knowledge', activePath: '/knowledge/organization' },
    { title: '应用市场', icon: theme === 'theme4' ? 'local_mall-o' : 'application_market', activePath: '/market/app-market' },

    // { title: '应用市场', icon: 'application_market', activePath: '/iam/choerodon/app-market' },
  ];

  async function goto(obj) {
    const queryObj = queryString.parse(history.location.search);
    const search = await getSearchString('organization', 'id', queryObj.organizationId);
    MenuStore.setActiveMenu(null);
    history.push(`${obj.activePath}${search}`);
  }

  function extraCls(list) {
    const { location: { pathname } } = props;
    if (pathname.startsWith(list.activePath)) {
      if ('exclude' in list) {
        if (!pathname.startsWith(list.exclude)) {
          return 'header-setting-active';
        }
      } else {
        return 'header-setting-active';
      }
    }
    return '';
  }

  return (
    <>
      {
        LI_MAPPING.map((list) => (
          <Button
            key={list.activePath}
            className={classNames({
              [`block ${extraCls(list)}`]: true,
              'theme4-headerButton': AppState.getCurrentTheme === 'theme4',
            })}
            onClick={() => goto(list)}
            type="primary"
            funcType="flat"
          >
            <Icon type={list.icon} style={iconStyle} />
            {list.title}
          </Button>
        ))
      }
    </>
  );
};

export default withRouter(inject('AppState', 'HeaderStore', 'MenuStore')(observer(Setting)));
