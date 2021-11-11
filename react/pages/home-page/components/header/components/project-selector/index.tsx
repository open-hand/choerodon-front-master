import React, { FormEvent, useEffect, useState } from 'react';

import { Select, Icon, Spin } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import Jsonbig from 'json-bigint';
import { ValueChangeAction } from 'choerodon-ui/pro/lib/text-field/enum';
import { useDebounceFn, useVirtualList } from 'ahooks';
// @ts-ignore
import queryString from 'query-string';
import { useQueryString } from '@choerodon/components';
import { withRouter } from 'react-router';
import { axios, WSHandler } from '@/index';
import handleClickProject from '@/utils/gotoProject';
import MenuStore from '@/containers/stores/c7n/MenuStore';
import getSearchString from '@/utils/gotoSome';
import './index.less';

const getListIsCurrentOrg = (starProject: any, recentProject: any, organizationId: any) => {
  const totalList = [
    ...starProject || [],
    ...recentProject || [],
  ];
  if (totalList && totalList.length > 0) {
    const flag = totalList.some((l) => String(l.organizationId) !== String(organizationId));
    if (flag) {
      return true;
    }
    return false;
  }
  return false;
};

const ProjectSelector = inject('AppState', 'HeaderStore')(observer((props:any) => {
  const Ref = React.createRef<any>();

  const prefixCls = 'c7ncd-dropDownPro';

  const {
    AppState,
    history,
  } = props;

  const [projectFilter, setProjectFilter] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [filterList, setFilterList] = useState([]);
  const { list, containerProps, wrapperProps } = useVirtualList(filterList, {
    overscan: 5,
    itemHeight: 46,
  });

  const { organizationId } = useQueryString();

  const { run } = useDebounceFn(async (value) => {
    setSpinning(true);
    // 如果新的值 不等于老的过滤值 则更新pagination为初始值
    setProjectFilter(value);
  }, {
    wait: 500,
  });

  /**
   * 这里是设置上过滤input的回调
   */
  useEffect(() => {
    async function callback() {
      // 如果有过滤值
      if (projectFilter) {
        const res = await axios.get(`/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/users/${AppState.getUserId}/projects/paging?page=0&size=0&params=${projectFilter}`);
        // @ts-ignore
        setFilterList(res.content);
        setSpinning(false);
      } else {
        setFilterList([]);
        setSpinning(false);
      }
    }
    callback();
  }, [projectFilter]);

  const handleClickPopContent = (value:any) => {
    setProjectFilter('');
    if (value.includes('star')) {
      const starItem = AppState.getStarProject.find((i:any) => String(i.id) === String(value.split('_')[1]));
      AppState.setDropDownPro(`项目: ${starItem.name}`);
      handleClickProject(starItem, history, AppState);
      Ref.current.setPopup(false);
      Ref.current.text = `项目: ${starItem.name}`;
    } else if (value.includes('recent')) {
      const recentItem = AppState.getRecentUse.find((i:any) => String(i.id) === String(value.split('_')[1]));

      AppState.setDropDownPro(`项目: ${recentItem.name}`);
      handleClickProject(recentItem, history, AppState);

      Ref.current.setPopup(false);
      Ref.current.text = `项目: ${recentItem.name}`;
    } else {
      const item: any = filterList.find((i:any) => String(i.id) === String(value));

      AppState.setDropDownPro(`项目: ${item?.name}`);
      handleClickProject(item, history, AppState);

      Ref.current.setPopup(false);
      Ref.current.text = `项目: ${item?.name}`;
    }
  };

  async function goto(obj:any) {
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

  const handleRenderPopRest = (filterStarProject: object[], filterRecentUser: object[]) => {
    if (filterList && filterList.length > 0) {
      return (
        <div {...containerProps} style={{ maxHeight: '300px', overflow: 'auto' }}>
          <div {...wrapperProps}>
            {list.map((i: any) => (
              <p
                style={{
                  height: 46,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                }}
                key={i.index}
                role="none"
                onClick={() => handleClickPopContent(`${i.data.id}`)}
                className={`${prefixCls}-popContent-option`}
              >
                {i.data.name}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return (
      <>
        <p className={`${prefixCls}-popContent-label`}>星标项目</p>
        {
            filterStarProject && filterStarProject.length > 0 ? filterStarProject.map((i:any) => (
              <p role="none" onClick={() => handleClickPopContent(`star_${i.id}`)} className={`${prefixCls}-popContent-option`}>{i.name}</p>
            )) : (
              <p className={`${prefixCls}-popContent-noOption`}>暂无星标项目</p>
            )
          }
        <p className={`${prefixCls}-popContent-label`}>最近使用</p>
        {
            filterRecentUser && filterRecentUser.length > 0 ? filterRecentUser.map((i:any) => (
              <p role="none" onClick={() => handleClickPopContent(`recent_${i.id}`)} className={`${prefixCls}-popContent-option`}>{i.name}</p>
            )) : (
              <p className={`${prefixCls}-popContent-noOption`}>暂无最近使用项目</p>
            )
          }
      </>
    );
  };

  const getPopContent = () => {
    const filterStarProject = AppState.getStarProject;
    const filterRecentUser = AppState.getRecentUse;
    return (
      <Spin spinning={spinning || getListIsCurrentOrg(filterStarProject, filterRecentUser, organizationId)}>
        <div className={`${prefixCls}-popContent`}>
          {handleRenderPopRest(filterStarProject, filterRecentUser)}
          <p role="none" onClick={handleGoAllProject} className={`${prefixCls}-popContent-allPro`}>
            <div>
              <Icon type="multistage_combo_box" />
              <span>查看所有项目</span>
            </div>
            <Icon type="navigate_next" />
          </p>
        </div>
      </Spin>
    );
  };

  const handleMessage = (d: any, k: string) => {
    if (k === 'star-projects') {
      AppState.setStarProject(Jsonbig.parse(d));
    } else {
      AppState.setRecentUse(Jsonbig.parse(d).map((i: any) => i.projectDTO));
    }
  };

  return (
    <>
      <WSHandler
        messageKey="star-projects"
        onMessage={(data: any) => handleMessage(data, 'star-projects')}
      >
        <>
        </>
      </WSHandler>
      <WSHandler
        messageKey="latest_visit"
        onMessage={(data: any) => handleMessage(data, 'latest_visit')}
      >
        <>
        </>
      </WSHandler>
      <Select
        valueChangeAction={'input' as ValueChangeAction}
        clearButton={false}
        ref={Ref as any}
        searchable
        value={AppState.getDropDownPro}
        onInput={(e:FormEvent<any>) => {
        // @ts-expect-error
          run(e.target.value);
        }}
        onBlur={() => {
          setProjectFilter('');
        }}
        placeholder="请选择项目"
        popupContent={getPopContent}
        className={prefixCls}
      />
    </>
  );
}));

export default withRouter(ProjectSelector);

export { getListIsCurrentOrg };
