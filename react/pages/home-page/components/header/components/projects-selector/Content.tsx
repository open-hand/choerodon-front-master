import React from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { Icon, Select } from 'choerodon-ui/pro';
import { useHistory } from 'react-router';
import RecentUseProjectsLists from './components/recent-use-projects-lists';
import StarProjectsLists from './components/star-projects-lists';

import { useProjectsSelectorStore } from './stores';
import FilterProjectsLists from './components/filter-projects-lists';
import { useQueryString } from '@/hooks';
import getSearchString from '@/utils/gotoSome';

const ProjectsSelector = (props:any) => {
  const {
    prefixCls,
    handleSelectorBlur,
    selectorRef,
  } = useProjectsSelectorStore();

  const {
    AppState,
  } = props;

  const {
    organizationId,
  } = useQueryString();

  const history = useHistory();

  // todo....
  const handleGoAllProject = async () => {
    const search = await getSearchString('organization', 'id', organizationId);
    handleSelectorBlur();
    history.push(`/projects${search}`);
  };

  const renderSelectorPopupContent = () => (
    <div className={`${prefixCls}-popup`}>
      {
        // 通过这个途径获取值
        !selectorRef.current?.text ? (
          <div className={`${prefixCls}-popup-common`}>
            <StarProjectsLists />
            <RecentUseProjectsLists />
            <div
              onClick={handleGoAllProject}
              role="none"
              className={`${prefixCls}-moreProjects`}
            >
              <Icon type="multistage_combo_box" />
              <span>查看所有项目</span>
              <Icon type="navigate_next" />
            </div>
          </div>
        ) : (
          <div className={`${prefixCls}-popup-virsualLists`}>
            <FilterProjectsLists />
          </div>
        )
      }
    </div>
  );

  const renderSelectorText = (data: { value: any; text: any; }) => {
    if (data.value) {
      return `项目: ${data.text}`;
    }
    return '';
  };

  // 组件问题，不写onInput或者onChange Select的下拉框不生效
  const handleInput = () => {};

  // 这里不用双向数据绑定，onInput只是个摆设，
  // selectorValues用来和输入的text（这里ref上是text值）区分开
  return (
    <Select
      className={`${prefixCls}`}
      clearButton={false}
      searchable
      renderer={renderSelectorText}
      ref={selectorRef}
      value={AppState.getDropDownPro}
      onInput={handleInput}
      placeholder="请选择项目"
      popupContent={renderSelectorPopupContent()}
    />
  );
};

export default inject('AppState')(observer(ProjectsSelector));
