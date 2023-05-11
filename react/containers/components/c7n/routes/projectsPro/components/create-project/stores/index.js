import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { DataSet } from 'choerodon-ui/pro';
import { some, forEach } from 'lodash';
import { injectIntl } from 'react-intl';
import useExternalFunc from '@/hooks/useExternalFunc';
import FormDataSet from './FormDataSet';
import StatusDataSet from './StatusDataSet';
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
    templateData,
  } = props;
  const { loading: haitianMasterLoading, func: createProjectExtraFields } = useExternalFunc('haitianMaster', 'haitianMaster:createProjectExtraFields');
  const { loading: baseSaasLoading, func: checkSenior } = useExternalFunc('saas', 'base-saas:checkSaaSSenior');

  const [flags, setFlags] = useState(false);

  const standardDisable = useMemo(() => [categoryCodes.require, categoryCodes.program, categoryCodes.operations], []);

  const createProjectStore = useStore();
  const categoryDs = useMemo(() => new DataSet(CategoryDataSet({
    organizationId, categoryCodes, createProjectStore, inNewUserGuideStepOne, setFlags,
  })), [organizationId]);

  const statusDs = useMemo(() => new DataSet(StatusDataSet({
    organizationId, projectId,
  })), [projectId]);

  const formDs = useMemo(() => new DataSet(FormDataSet({
    organizationId, categoryDs, projectId, categoryCodes, inNewUserGuideStepOne, statusDs, func: createProjectExtraFields,
  })), [organizationId, projectId, statusDs, inNewUserGuideStepOne, createProjectExtraFields]);

  useEffect(() => {
    if (!baseSaasLoading && !haitianMasterLoading) {
      if (projectId) {
        loadData(checkSenior?.default);
      } else {
        formDs.create();
        loadCategory(checkSenior?.default);
      }
    }
  }, [projectId, organizationId, checkSenior, baseSaasLoading, haitianMasterLoading, createProjectExtraFields]);

  const loadCategory = async (checkSeniorFunc) => {
    await axios.all([
      categoryDs.query(),
      createProjectStore.checkSenior(organizationId, checkSeniorFunc),
    ]);
    const isSenior = createProjectStore.getIsSenior; // saas高级版

    // agile: 敏捷管理，program：敏捷项目群，waterfall：瀑布管理 ，require： 需求管理，devops： DevOps ， programProject：项目群子项目 ，test： 测试管理，

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
    } else if (templateData) {
      categoryDs.forEach((record) => {
        if (templateData?.categoryCodes?.indexOf(record.get('code')) !== -1) {
          // eslint-disable-next-line no-param-reassign
          record.isSelected = true;
          if (record.get('code') !== categoryCodes.require) {
            record.setState('disabled', true);
          }
        } else if ([categoryCodes.agile, categoryCodes.program, categoryCodes.waterfall].includes(record.get('code'))) {
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

  const loadData = async (checkSeniorFunc) => {
    try {
      await statusDs.query();
      await categoryDs.query();
      const projectData = await formDs.query();
      await createProjectStore.checkSenior(organizationId, checkSeniorFunc);

      const isSenior = createProjectStore.getIsSenior;
      if (projectData && projectData.categories && projectData.categories.length) {
        const isBeforeProgram = (projectData.beforeCategory || '')?.split(',')?.includes(categoryCodes.program);
        const isBeforeAgile = (projectData.beforeCategory || '').includes(categoryCodes.agile);
        const isBeforeWaterfall = (projectData.beforeCategory || '').includes(categoryCodes.waterfall);
        let isProgram = false;
        let isProgramProject = false;
        let isRequire = false;
        let isAgile = false;
        let isWaterfall = false;
        forEach(projectData.categories, async ({ code: categoryCode }) => {
          switch (categoryCode) {
            case categoryCodes.waterfall:
              isWaterfall = true;
              break;
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
          isBeforeWaterfall,
          isAgile,
          isProgram,
          isWaterfall,
        });
        categoryDs.forEach(async (categoryRecord) => {
          const currentCode = categoryRecord.get('code');
          if (some(projectData.categories, ['code', currentCode])) {
            if (currentCode === categoryCodes.agile) {
              if (isBeforeProgram === false) {
                categoryDs.select(categoryRecord);
              }
            } else {
              categoryDs.select(categoryRecord);
            }
          }
          switch (currentCode) {
            case categoryCodes.program:
              categoryRecord.setState({
                isProgram: isBeforeProgram,
              });
              categoryRecord.setState('agilePro', true);
              if (!isSenior || (isBeforeAgile && !isBeforeProgram) || (isProgram && await createProjectStore.hasProgramProjects(organizationId, projectId)) || isBeforeWaterfall) {
                categoryRecord.setState('disabled', true);
              }
              break;
            case categoryCodes.agile:
              categoryRecord.setState({
                isAgile: isBeforeAgile,
                disabled: isProgramProject || (isBeforeProgram && !isProgram) || isBeforeWaterfall,
              });
              categoryRecord.setState('agile', true);
              break;
            case categoryCodes.require:
              categoryRecord.setState({
                isRequire,
                disabled: !isSenior || (!isProgram && !isAgile && !isWaterfall),
              });
              break;
            case categoryCodes.operations:
              categoryRecord.setState('disabled', !isSenior);
              break;
              // 项目之前是 敏捷或项目群 不能选瀑布
              // 项目之前是瀑布 不能再选敏捷和项目群
            case categoryCodes.waterfall:
              categoryRecord.setState({
                disabled: isBeforeProgram || isBeforeAgile,
              });
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
    standardDisable,
    organizationId,
    formDs,
    categoryDs,
    createProjectStore,
    setFlags,
    flags,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
