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
    categoryCodes,
  } = props;

  const createProjectStore = useStore();
  const categoryDs = useMemo(() => new DataSet(CategoryDataSet({ organizationId, categoryCodes })), [organizationId]);
  const formDs = useMemo(() => new DataSet(FormDataSet({
    organizationId, categoryDs, projectId, categoryCodes,
  })), [organizationId, projectId]);

  useEffect(() => {
    if (projectId) {
      loadData();
    } else {
      formDs.create();
      loadCategory();
    }
  }, [projectId, organizationId]);

  const loadCategory = async () => {
    await categoryDs.query();
    const findRecord = categoryDs.find((eachRecord) => eachRecord.get('code') === categoryCodes.require);
    findRecord && findRecord.setState('disabled', true);
  };

  const loadData = async () => {
    try {
      const [, projectData] = await axios.all([categoryDs.query(), formDs.query()]);
      if (projectData && projectData.categories && projectData.categories.length) {
        let isProgram = false;
        let isProgramProject = false;
        let isRequire = false;
        let isAgile = false;
        forEach(projectData.categories, async ({ code: categoryCode }) => {
          switch (categoryCode) {
            case categoryCodes.program:
              isProgram = true;
              break;
            case categoryCodes.programProject:
              isProgramProject = true;
              break;
            case categoryCodes.require:
              isRequire = true;
              break;
            case categoryCodes.agile:
              isAgile = true;
              break;
            default:
              break;
          }
        });
        categoryDs.forEach(async (categoryRecord) => {
          const currentCode = categoryRecord.get('code');
          if (some(projectData.categories, ['code', currentCode])) {
            categoryDs.select(categoryRecord);
          }
          switch (currentCode) {
            case categoryCodes.program:
              if ((projectData.beforeCategory || '').includes(categoryCodes.program)) {
                categoryRecord.setState('isProgram', true);
              }
              if (isProgram && await createProjectStore.hasProgramProjects(organizationId, projectId)) {
                categoryRecord.setState('disabled', true);
              }
              break;
            case categoryCodes.agile:
              if ((projectData.beforeCategory || '').includes(categoryCodes.agile)) {
                categoryRecord.setState('isAgile', true);
              }
              if (isProgramProject) {
                categoryRecord.setState('disabled', true);
              }
              break;
            case categoryCodes.require:
              categoryRecord.setState('isRequire', isRequire);
              categoryRecord.setState('disabled', !isProgram && !isAgile);
              break;
            default:
              break;
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
    intlPrefix: 'c7ncd.project',
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
