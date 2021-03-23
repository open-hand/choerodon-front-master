import React, { useCallback, useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { DataSet, DatePicker } from 'choerodon-ui/pro';
import { debounce, includes } from 'lodash';
import moment from 'moment';
import AppState from '@/containers/stores/c7n/AppState';
import { useProjectOverviewStore } from '../../../../stores';
import SelectUser from '../select/select-user';
import SelectType, { IDynamicType } from '../select/select-type';

const IssueTypeCodeArr = ['task', 'story', 'bug', 'sub_task', 'issue_epic', 'feature'];
const DynamicSearch = () => {
  const clsPrefix = 'c7n-project-overview-projectDynamic-search';
  const {
    projectDynamicDs,
  } = useProjectOverviewStore();

  const currentProject = AppState.getCurrentProject;
  const typeDataRef = useRef<IDynamicType[]>();

  const searchDsUpdate = useCallback(({
    // @ts-ignore
    name, value,
  }) => {
    if (name === 'dateRange') {
      console.log(name, value);
      if (value) {
        projectDynamicDs.setQueryParameter('startDate', (value[0] && value[0].startOf('day').format('YYYY-MM-DD HH:mm:ss')) || currentProject.creationDate);
        projectDynamicDs.setQueryParameter('endDate', value[1] && value[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'));
      } else {
        projectDynamicDs.setQueryParameter('startDate', currentProject.creationDate);
        projectDynamicDs.setQueryParameter('endDate', undefined);
      }
    }
    if (name === 'types') {
      const typeIds: string[] = [];
      const otherTypes: string[] = [];
      if (value && value.length) {
        value.forEach((typeId: string) => {
          const type = (typeDataRef?.current || []).find((item) => item.id === typeId);
          if (type && includes(IssueTypeCodeArr, type.code)) {
            typeIds.push(typeId);
          } else {
            otherTypes.push(typeId);
          }
        });
        projectDynamicDs.setQueryParameter('typeIds', typeIds);
        projectDynamicDs.setQueryParameter('otherTypes', otherTypes);
      } else {
        projectDynamicDs.setQueryParameter('typeIds', undefined);
        projectDynamicDs.setQueryParameter('otherTypes', undefined);
      }
    }
    if (name === 'createdByIds') {
      projectDynamicDs.setQueryParameter('createdByIds', value);
    }
    projectDynamicDs.query();
  }, [currentProject.creationDate, projectDynamicDs]);

  const projectDynamicSearchDs = useMemo(() => new DataSet({
    autoCreate: true,
    paging: true,
    autoQuery: false,
    pageSize: 20,
    fields: [{
      name: 'dateRange',
      max: moment(),
      min: moment(currentProject.creationDate),
    }, {
      name: 'types',
      multiple: true,
      textField: 'name',
      valueField: 'id',
    }, {
      name: 'createdByIds',
      multiple: true,
      textField: 'realName',
      valueField: 'id',
    }],
    data: [{
      dateRange: [new Date(), undefined],
    }],
    events: {
      update: debounce((updateData: any) => {
        searchDsUpdate(updateData);
      }, 500),
    },
  }), [currentProject.creationDate, searchDsUpdate]);

  return (
    <div className={clsPrefix}>
      <DatePicker
        dataSet={projectDynamicSearchDs}
        name="dateRange"
        range
        placeholder={['开始时间', '结束时间']}
      />
      <SelectType
        dataSet={projectDynamicSearchDs}
        name="types"
        placeholder="按类型查看"
        maxTagCount={2}
        maxTagTextLength={5}
        style={{
          marginLeft: 10,
        }}
        dataRef={typeDataRef}
      />
      <SelectUser
        dataSet={projectDynamicSearchDs}
        name="createdByIds"
        placeholder="按人员查看"
        maxTagCount={2}
        maxTagTextLength={5}
        style={{
          marginLeft: 10,
        }}
      />
    </div>
  );
};

export default observer(DynamicSearch);
