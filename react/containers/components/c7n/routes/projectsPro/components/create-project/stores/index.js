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
    inNewUserGuideStepOne,
  } = props;

  const standardDisable = useMemo(() => [categoryCodes.require, categoryCodes.program, categoryCodes.operations], []);

  const createProjectStore = useStore();
  const categoryDs = useMemo(() => new DataSet(CategoryDataSet({
    organizationId, categoryCodes, createProjectStore, inNewUserGuideStepOne,
  })), [organizationId]);
  const formDs = useMemo(() => new DataSet(FormDataSet({
    organizationId, categoryDs, projectId, categoryCodes, inNewUserGuideStepOne,
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
    const isSenior = createProjectStore.getIsSenior; // saas高级版

    // 新手指导默认选中值处理
    if (inNewUserGuideStepOne) {
      const seniorDefaultArr = ['N_AGILE', 'N_REQUIREMENT', 'N_DEVOPS', 'N_OPERATIONS', 'N_TEST'];
      const otherDefaultArr = ['N_AGILE', 'N_DEVOPS', 'N_TEST'];
      const currentArr = isSenior ? seniorDefaultArr : otherDefaultArr;
      categoryDs.forEach((record) => {
        if (currentArr.indexOf(record.get('code')) !== -1) {
          // eslint-disable-next-line no-param-reassign
          record.isSelected = true;
        } else {
          record.setState('disabled', true);
        }
      });
    } else {
      categoryDs.forEach((eachRecord) => {
        const categoryRecord = eachRecord.get('code');
        if (categoryRecord === categoryCodes.require
          || (!isSenior && standardDisable.includes(categoryRecord))) {
          eachRecord.setState('disabled', true);
        }
      });
    }
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
        const isBeforeProgram = (projectData.beforeCategory || '')?.split(',')?.includes(categoryCodes.program);
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
        categoryDs.setState({
          isEdit: true,
          isBeforeAgile,
          isBeforeProgram,
          isCurrentAgile: isAgile,
          isCurrentProgram: isProgram,
        });
        categoryDs.forEach(async (categoryRecord) => {
          const currentCode = categoryRecord.get('code');
          if (some(projectData.categories, ['code', currentCode])) {
            categoryDs.select(categoryRecord);
          }
          switch (currentCode) {
            case categoryCodes.program:
              categoryRecord.setState({
                isProgram: isBeforeProgram,
                isCurrentProgram: isProgram,
              });
              if (!isSenior || (isBeforeAgile && !isBeforeProgram) || (isProgram && await createProjectStore.hasProgramProjects(organizationId, projectId))) {
                categoryRecord.setState('disabled', true);
              }
              break;
            case categoryCodes.agile:
              categoryRecord.setState({
                isAgile: isBeforeAgile,
                disabled: isProgramProject || (isBeforeProgram && !isProgram),
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
