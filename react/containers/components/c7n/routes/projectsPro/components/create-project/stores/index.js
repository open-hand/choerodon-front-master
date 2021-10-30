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
import axios from '@/components/axios';
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

  const standardDisable = useMemo(() => [categoryCodes.require, categoryCodes.program, categoryCodes.operations], []);

  const createProjectStore = useStore();
  const categoryDs = useMemo(() => new DataSet(CategoryDataSet({ organizationId, categoryCodes, createProjectStore })), [organizationId]);
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
    await axios.all([
      categoryDs.query(),
      createProjectStore.checkSenior(organizationId),
    ]);
    const isSenior = createProjectStore.getIsSenior;
    categoryDs.forEach((eachRecord) => {
      const categoryRecord = eachRecord.get('code');
      if (categoryRecord === categoryCodes.require
        || (!isSenior && standardDisable.includes(categoryRecord))) {
        eachRecord.setState('disabled', true);
      }
    });
  };

  const loadData = async () => {
    try {
      const [, projectData] = await axios.all([
        categoryDs.query(),
        formDs.query(),
        createProjectStore.checkSenior(organizationId),
      ]);
      const isSenior = createProjectStore.getIsSenior;
      if (projectData && projectData.categories && projectData.categories.length) {
        const isBeforeProgram = (projectData.beforeCategory || '').includes(categoryCodes.program);
        const isBeforeAgile = (projectData.beforeCategory || '').includes(categoryCodes.agile);
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
              categoryRecord.setState('isProgram', isBeforeProgram);
              if (!isSenior || isBeforeAgile || (isProgram && await createProjectStore.hasProgramProjects(organizationId, projectId))) {
                categoryRecord.setState('disabled', true);
              }
              break;
            case categoryCodes.agile:
              categoryRecord.setState({
                isAgile: isBeforeAgile,
                disabled: isBeforeProgram || isProgramProject,
              });
              break;
            case categoryCodes.require:
              categoryRecord.setState({
                isRequire,
                disabled: !isSenior || (!isProgram && !isAgile),
              });
              break;
            case categoryCodes.operations:
              categoryRecord.setState('disabled', !isSenior);
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
    standardDisable,
    organizationId,
    formDs,
    categoryDs,
    createProjectStore,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
