import React, { useMemo, useEffect, useState } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { get } from '@choerodon/inject';
import { Button as ProButton } from 'choerodon-ui/pro';
import { Button, Icon } from 'choerodon-ui';
import _ from 'lodash';
import classNames from 'classnames';
import forEach from 'lodash/forEach';
import { Permission } from '@/components/permission';
import getSearchString from '../../util/gotoSome';

import './headerSettingTheme4.less';

const iconStyle = { marginLeft: 0, marginRight: 0 };
const SERVICE_CODE = {
  knowledge: 'knowledgebase-service',
  market: 'market-service',
};

const Setting = ({
  AppState, HeaderStore, MenuStore, history, ...props
}) => {
  const isSaas = AppState.getIsSaasList;

  // 组织改变 重新查询getIsSaas
  useEffect(() => {
    if (isSaas && !Object.keys(isSaas).includes(AppState.currentMenuType.organizationId)) {
      get('base-saas:getIsSaas') && get('base-saas:getIsSaas')(AppState, isSaas);
    }
  }, [AppState.currentMenuType.organizationId]);

  useEffect(() => {
    get('base-saas:getIsSaas') && get('base-saas:getIsSaas')(AppState, isSaas);
  }, []);

  const theme = 'theme4';
  const { currentServices } = AppState;

  const LI_MAPPING = useMemo(() => {
    const mapping = [
      { title: '工作台', icon: theme === 'theme4' ? 'home-o' : 'home', activePath: '/workbench' },
      { title: '工作日历', icon: theme === 'theme4' ? 'home-o' : 'home', activePath: '/agile/work-calendar' },
      // {
      //   title: '项目', icon: theme === 'theme4' ? 'project_line' : 'project_filled', activePath: '/projects', style: { marginLeft: 3 },
      // },
    ];
    forEach(currentServices, ({ serviceCode }) => {
      switch (serviceCode) {
        case SERVICE_CODE.knowledge:
          mapping.push({
            title: '知识库',
            icon: theme === 'theme4' ? 'chrome_reader_mode-o' : 'knowledge',
            activePath: '/knowledge/organization',
            style: { marginLeft: 4 },
            permission: [
              'choerodon.code.organization.knowledge.ps.default',
              'choerodon.code.organization.knowledge.ps.recycle',
            ],
          });
          break;
        case SERVICE_CODE.market:
          // 如果不是saas 才显示应用市场
          if (!isSaas || !isSaas[AppState.currentMenuType.organizationId]) {
            mapping.push({
              title: '应用市场',
              icon: theme === 'theme4' ? 'local_mall-o' : 'application_market',
              activePath: '/market/app-market',
              style: { marginLeft: 2 },
            });
          }
          break;
      }
    });
    return mapping;
  }, [currentServices, theme, isSaas, AppState.currentMenuType.organizationId]);

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
        LI_MAPPING.map((list, index) => {
          const button = (
            <Button
              key={list.activePath}
              className={classNames({
                [`block ${extraCls(list)}`]: true,
                'theme4-headerButton': true,
              })}
              {...index === 0 ? {
                style: {
                  marginLeft: '-8px',
                },
              } : {}}
              onClick={() => goto(list)}
              type="primary"
              funcType="flat"
            >
              {/* <Icon type={list.icon} style={iconStyle} /> */}
              <span
                {...true && list.style ? {
                  style: list.style,
                } : {}}
              >
                {list.title}
              </span>
            </Button>
          );
          return list.permission ? (
            <Permission type="organization" service={list.permission}>
              {button}
            </Permission>
          ) : button;
        })
      }
    </>
  );
};

export default withRouter(inject('AppState', 'HeaderStore', 'MenuStore')(observer(Setting)));
