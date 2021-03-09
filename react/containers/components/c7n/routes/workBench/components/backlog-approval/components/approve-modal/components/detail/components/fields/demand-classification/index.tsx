import React from 'react';
import { observer } from 'mobx-react-lite';
import Field from '../field';
import './index.less';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';

interface Props {
  store: DemandDetailStore,
}
const DemandClassification: React.FC<Props> = ({ store }) => {
  const { demand } = store;
  const backlogClassificationVO = demand.backlogClassificationVO || {};
  const { name } = backlogClassificationVO;
  return (
    <Field label="需求分类">
      <div>
        {name || '无'}
      </div>
    </Field>
  );
};

export default observer(DemandClassification);
