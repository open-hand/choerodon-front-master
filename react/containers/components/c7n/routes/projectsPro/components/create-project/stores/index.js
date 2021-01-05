import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { DataSet } from 'choerodon-ui/pro';
import forEach from 'lodash/forEach';
import some from 'lodash/some';
import { injectIntl } from 'react-intl';
import FormDataSet from './FormDataSet';
import CategoryDataSet from './CategoryDataSet';
import axios from '../../../../../tools/axios';
import useStore from './useStore';

const Store = createContext();

export function useCreateProjectProStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(injectIntl(inject('AppState')((props) => {
  const {
    children,
    AppState: {
      currentMenuType: {
        organizationId,
      },
    },
    projectId,
  } = props;

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

  const createProjectStore = useStore();
  const categoryDs = useMemo(() => new DataSet(CategoryDataSet({ organizationId, categoryCodes })), [organizationId]);
  const formDs = useMemo(() => new DataSet(FormDataSet({
    organizationId, categoryDs, projectId, categoryCodes,
  })), [organizationId, projectId]);

  useEffect(() => {
    if (projectId) {
      loadData();
    } else {
      categoryDs.query();
      formDs.create();
    }
  }, [projectId, organizationId]);

  const loadData = async () => {
    try {
      const [, projectData] = await axios.all([categoryDs.query(), formDs.query()]);
      if (projectData && projectData.categories && projectData.categories.length) {
        let isProgram = false;
        let isProgramProject = false;
        forEach(projectData.categories, async ({ code: categoryCode }) => {
          if (categoryCode === categoryCodes.program) {
            isProgram = true;
          }
          if (categoryCode === categoryCodes.programProject) {
            isProgramProject = true;
          }
        });
        categoryDs.forEach(async (categoryRecord) => {
          const currentCode = categoryRecord.get('code');
          if (some(projectData.categories, ['code', currentCode])) {
            categoryDs.select(categoryRecord);
          }
          if ((currentCode === categoryCodes.agile && isProgramProject)
            || (currentCode === categoryCodes.program && isProgram && await createProjectStore.hasProgramProjects(organizationId, projectId))
          ) {
            categoryRecord.setState('disabled', true);
          }
        });
      }
    } catch (e) {
      //
    }
  };

  const value = {
    ...props,
    prefixCls: 'c7ncd-project-create',
    categoryCodes,
    organizationId,
    formDs,
    categoryDs,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
