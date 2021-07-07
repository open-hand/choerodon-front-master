import React, { FormEvent, useEffect, useState } from 'react';

import { Select, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import { ValueChangeAction } from 'choerodon-ui/pro/lib/text-field/enum';
import { useDebounce } from 'ahooks';
import handleClickProject from "@/containers/components/util/gotoProject";
// @ts-expect-error
import queryString from 'query-string';
import findFirstLeafMenu from '@/containers/components/util/findFirstLeafMenu';
import { historyPushMenu } from '@/utils';
import MenuStore, { getMenuType } from '@/containers/stores/c7n/MenuStore';
import getSearchString from '@/containers/components/c7n/util/gotoSome';
import './index.less';
import { withRouter } from 'react-router';

const ProjectSelector = inject('AppState', 'HeaderStore')(observer((props: any) => {
  const Ref = React.createRef<any>();

  const prefixCls = 'c7ncd-dropDownPro';

  const [projectFilter, setProjectFilter] = useState('');

  const debouncedFilter = useDebounce(projectFilter, { wait: 500 });

  const {
    AppState,
    history,
    HeaderStore,
  } = props;

  const handleClickPopContent = (value: any) => {
    setProjectFilter('');
    if (value.includes('star')) {
      const starItem = AppState.getStarProject.find((i: any) => String(i.id) === String(value.split('_')[1]));
      AppState.setDropDownPro(`项目: ${starItem.name}`);
      handleClickProject(starItem, history, AppState);
      Ref.current.setPopup(false);
      Ref.current.text = `项目: ${starItem.name}`;
    } else {
      const recentItem = AppState.getRecentUse.find((i: any) => String(i.id) === String(value.split('_')[1]));

      AppState.setDropDownPro(`项目: ${recentItem.name}`);
      handleClickProject(recentItem, history, AppState);

      Ref.current.setPopup(false);
      Ref.current.text = `项目: ${recentItem.name}`;
    }
  };

  async function goto(obj: any) {
    const queryObj = queryString.parse(history.location.search);
    const search = await getSearchString('organization', 'id', queryObj.organizationId);
    MenuStore.setActiveMenu(null);
    Ref.current.setPopup(false);
    history.push(`${obj.activePath}${search}`);
  }

  const handleGoAllProject = () => {
    const data = {
      title: '项目', icon: 'project_line', activePath: '/projects', style: { marginLeft: 3 },
    };
    goto(data);
  };

  const getPopContent = () => {
    const filterStarProject = AppState.getStarProject.filter((i: any) => i.name.includes(debouncedFilter));
    const filterRecentUser = AppState.getRecentUse.filter((i: any) => i.name.includes(debouncedFilter));
    return (
      <div className={`${prefixCls}-popContent`}>
        <p className={`${prefixCls}-popContent-label`}>星标项目</p>
        {
          filterStarProject && filterStarProject.length > 0 ? filterStarProject.map((i: any) => (
            <p role="none" onClick={() => handleClickPopContent(`star_${i.id}`)} className={`${prefixCls}-popContent-option`}>{i.name}</p>
          )) : (
            <p className={`${prefixCls}-popContent-noOption`}>暂无星标项目</p>
          )
        }
        <p className={`${prefixCls}-popContent-label`}>最近使用</p>
        {
          filterRecentUser && filterRecentUser.length > 0 ? filterRecentUser.map((i: any) => (
            <p role="none" onClick={() => handleClickPopContent(`recent_${i.id}`)} className={`${prefixCls}-popContent-option`}>{i.name}</p>
          )) : (
            <p className={`${prefixCls}-popContent-noOption`}>暂无最近使用项目</p>
          )
        }
        <p role="none" onClick={handleGoAllProject} className={`${prefixCls}-popContent-allPro`}>
          <div>
            <Icon type="multistage_combo_box" />
            <span>查看所有项目</span>
          </div>
          <Icon type="navigate_next" />
        </p>
      </div>
    );
  };

  return (
    <Select
      valueChangeAction={'input' as ValueChangeAction}
      clearButton={false}
      ref={Ref as any}
      searchable
      value={AppState.getDropDownPro}
      onInput={(e: FormEvent<any>) => {
        // @ts-expect-error
        setProjectFilter(e.target.value);
      }}
      onBlur={() => {
        setProjectFilter('');
      }}
      placeholder="请选择项目"
      popupContent={getPopContent}
      className={prefixCls}
    />
  );
}));

export default withRouter(ProjectSelector);
