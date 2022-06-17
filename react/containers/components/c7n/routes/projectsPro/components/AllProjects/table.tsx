import { DataSet, Table } from 'choerodon-ui/pro';
import React, { useMemo } from 'react';
import { inject } from 'mobx-react';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import TableDs from './tableDataSet';
import Action from '@/components/action';

export interface IProps {

}

const { Column } = Table;

const Index:React.FC<IProps> = (props) => {
  { /*  @ts-ignore */ }
  const { AppState: { getUserId, currentMenuType: { organizationId } } } = props;

  const tableDs = useMemo(() => {
    const ds = new DataSet(TableDs(
      { organizationId, userId: getUserId },
    ));
    return ds;
  }, []);

  const handleEnabledProj = (pid:string) => {

  };

  const handleDisableProj = (pid:string) => {

  };

  const renderAction = ({ record }: { record: Record }) => {
    const actionDatas = [{
      service: [],
      text: '修改',
      action: () => { },
    }];
    record.get('enabled') ? actionDatas.push({
      service: [],
      text: '停用',
      action: () => { handleEnabledProj(record.get('id')); },
    }) : actionDatas.push({
      service: [],
      text: '启用',
      action: () => { handleDisableProj(record.get('id')); },
    });
    return <Action data={actionDatas} />;
  };

  return (
    <Table dataSet={tableDs} queryBar={'none' as any}>
      <Column name="name" width={250} />
      <Column renderer={renderAction} width={50} />
    </Table>
  );
};

export default inject('AppState')(Index);
