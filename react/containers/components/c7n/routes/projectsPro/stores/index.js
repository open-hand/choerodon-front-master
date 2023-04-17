import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { DataSet } from 'choerodon-ui/pro';
import { injectIntl } from 'react-intl';
import useExternalFunc from '@/hooks/useExternalFunc';
import useStore from './useStore';
import ListDataSet from './ListDataSet';
import CategoryDataSet from './CategoryDataSet';
import ProjectListDataSet from './projectListDataSet';
import { useFormatMessage, useFormatCommon } from '@/hooks';

const Store = createContext();

export function useProjectsProStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(injectIntl(inject('AppState', 'MenuStore')((props) => {
  const {
    children,
    AppState,
    AppState: {
      currentMenuType: {
        type,
        id,
        organizationId,
      },
      getUserId,
    },
    history,
  } = props;

  const { loading: haitianMasterLoading, func } = useExternalFunc('haitianMaster', 'haitianMaster:createProjectExtraFields');
  const formatProject = useFormatMessage(intlPrefix);

  const ProjectsProUseStore = useStore(AppState, history);
  const categoryDs = useMemo(() => new DataSet(CategoryDataSet(AppState, history)), [type, id, organizationId]);
  const dataSet = useMemo(() => new DataSet(ListDataSet(AppState, history, categoryDs)), [type, id, organizationId]);
  const projectListDataSet = useMemo(() => {
    if (haitianMasterLoading) {
      return new DataSet({
        autoCreate: true,
      });
    }
    return new DataSet(ProjectListDataSet({
      organizationId, userId: getUserId, func, formatProject,
    }));
  }, [type, id, organizationId, func, haitianMasterLoading]);

  const categoryCodes = useMemo(() => ({
    devops: 'N_DEVOPS',
    agile: 'N_AGILE',
    program: 'N_PROGRAM',
    test: 'N_TEST',
    require: 'N_REQUIREMENT',
    operations: 'N_OPERATIONS',
    programProject: 'N_PROGRAM_PROJECT',
    waterfall: 'N_WATERFALL',
  }), []);

  const intlPrefix = 'c7ncd.project';
  const prefix = '.c7ncd-allprojectslist-table';

  const formatCommon = useFormatCommon();

  const value = {
    ...props,
    intlPrefix,
    dataSet,
    ProjectsProUseStore,
    categoryCodes,
    formatProject,
    formatCommon,
    projectListDataSet,
    prefix,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
