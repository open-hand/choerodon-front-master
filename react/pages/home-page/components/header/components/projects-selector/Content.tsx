import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { ValueChangeAction } from 'choerodon-ui/pro/lib/text-field/enum';
import { Select } from 'choerodon-ui/pro';
import { useProjectsSelectorStore } from './stores';
import {} from '@choerodon/components';

const ProjectsSelector = observer(() => {
  const {
    mainStore,
    prefixCls,
  } = useProjectsSelectorStore();

  useEffect(() => {

  }, []);

  return (
    <div className={prefixCls}>
      <Select
        valueChangeAction={'input' as ValueChangeAction}
        clearButton={false}
        searchable
      />
    </div>
  );
});

export default ProjectsSelector;
