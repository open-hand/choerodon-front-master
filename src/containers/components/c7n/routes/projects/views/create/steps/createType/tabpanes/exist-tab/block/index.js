import React, { useContext } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';
import Store from '../stores';
// import Card from './Card';

const ListView = observer(() => {
  const { dataSet, context: { dataSet: outDs }, filter } = useContext(Store);

  // function renderCard(record) {
  //   const cardPlainObj = record.toData();
  //   return <Card {...cardPlainObj} />;
  // }

  function handleClick(record) {
    const createRecord = outDs.current;
    const currentValue = createRecord.get('createByExist');
    const selectedValue = record.get('id');
    if (currentValue === selectedValue) {
      createRecord.set('createByExist', undefined);
      createRecord.set('category', 'AGILE');
    } else {
      createRecord.set('createByExist', selectedValue);
      createRecord.set('category', record.get('category'));
    }
  }

  function renderCard(record) {
    const createRecord = outDs.current;
    const currentValue = createRecord.get('createByExist');
    const idActive = record.get('id') === currentValue;
    const classNames = classnames({
      card: true,
      active: idActive,
    });
    return (
      <div className={classNames} onClick={() => handleClick(record)}>
        <div className="card-body">
          <Icon type="playlist_add" style={{ color: '#3f51b5', fontSize: '64px' }} />
        </div>
        <div className="card-footer">{record.get('name')}</div>
        <div className="check-icon" style={{ display: idActive ? 'block' : 'none' }}>
          <Icon type="check" />
        </div>
      </div>
    );
  }

  function getFilterdData() {
    if (!filter) {
      return dataSet;
    }
    return dataSet.filter(r => (r.get('name') || '').indexOf(filter) > -1 || (r.get('name') || '').indexOf(filter) > -1);
  }

  return (
    <div className="create-project-tab-card-block">
      {getFilterdData().map(r => renderCard(r))}
    </div>
  );
});

export default ListView;
