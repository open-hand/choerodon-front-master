import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { DataSet } from 'choerodon-ui/pro';
import { injectIntl } from 'react-intl';
import FormDataSet from './FormDataSet';
import CategoryDataSet from './CategoryDataSet';
import axios from '../../../../../tools/axios';

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

  const categoryDs = useMemo(() => new DataSet(CategoryDataSet(organizationId)), [organizationId]);
  const formDs = useMemo(() => new DataSet(FormDataSet({ organizationId, categoryDs, projectId })), [organizationId]);

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
        categoryDs.forEach((categoryRecord) => {
          if (projectData.categories?.some(({ code: categoryCode }) => categoryCode === categoryRecord.get('code'))) {
            // eslint-disable-next-line no-param-reassign
            categoryRecord.isSelected = true;
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
    categoryIcon: {
      N_DEVOPS: 'devops',
      N_AGILE: 'agile',
      N_PROGRAM: 'agile',
      N_TEST: 'test',
      N_REQUIREMENT: 'require',
      N_OPERATIONS: 'operations',
    },
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
