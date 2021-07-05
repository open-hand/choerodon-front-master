import React, { useMemo, forwardRef } from 'react';
import { Select } from 'choerodon-ui/pro';
import { find } from 'lodash';
import useSelect, { SelectConfig } from '@/hooks/useSelect';
import { SelectProps } from 'choerodon-ui/pro/lib/select/Select';
import { FlatSelect } from '@choerodon/components';
import { issueTypeApi } from '@/containers/components/c7n/routes/projectOverview/components/project-dynamic/api';
import { IIssueType } from '@/types';

export interface IDynamicType {
  id: string,
  name: string,
  code: string,
}

interface Props extends Partial<SelectProps> {
  request?: SelectConfig<any>['request']
  afterLoad?: (sprints: IDynamicType[]) => void
  dataRef?: React.MutableRefObject<any>
  valueField?: string
  flat?: boolean
  otherTypes?: IDynamicType[]
}

const SelectIssueType: React.FC<Props> = forwardRef(({
  request, valueField, dataRef, flat,
  afterLoad, otherTypes = [], ...otherProps
}, ref: React.Ref<Select>) => {
  const config = useMemo((): SelectConfig => ({
    name: 'dynamicTypes',
    textField: 'name',
    valueField: valueField || 'id',
    // @ts-ignore
    request: () => issueTypeApi.loadAvailableIssueType(),
    middleWare: (issueTypes: IIssueType[]) => {
      const enabledIssueTypes: IDynamicType[] = issueTypes.filter((item) => item.enabled).map(((item) => ({
        id: item.typeCode !== 'backlog' ? item.id : 'backlog',
        code: item.typeCode,
        name: item.name,
      })));

      const dynamicTypes: IDynamicType[] = [...enabledIssueTypes, ...otherTypes];
      if (afterLoad) {
        afterLoad(dynamicTypes);
      }
      if (dataRef) {
        Object.assign(dataRef, {
          current: dynamicTypes,
        });
      }
      return dynamicTypes;
    },
    paging: false,
  }), [afterLoad, dataRef, otherTypes, valueField]);
  const props = useSelect(config);
  const Component = flat ? FlatSelect : Select;

  return (
    <Component
      ref={ref}
      {...props}
      {...otherProps}
    />
  );
});
export default SelectIssueType;
