import React, {
  useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { useRequestChartStore } from './stores';
// import {} from '@choerodon/master';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';
import OverviewWrap from '../OverviewWrap';

const { Header } = OverviewWrap as any;
const RequestChart = () => {
  const {
    mainStore,
    prefixCls,
    // formatRequestChart,
    // formatCommon,
  } = useRequestChartStore();

  useEffect(() => {

  }, []);

  const renderTitle = () => (
    <div className={`${prefixCls}-title`}>
      <span>待审核合并请求</span>
      {/* <Tooltip title="当前迭代各个工作项在不同状态下的数量统计。" placement="top">
        <Icon type="help" className={`${clsPrefix}-icon`} />
      </Tooltip> */}
    </div>
  );
  return (
    <OverviewWrap>
      <Header
        titleMarginBottom={12}
        title={renderTitle()}
        style={{
          margin: '0 0 10px 4px',
        }}
      >
        {/* {render()} */}

      </Header>
      {/* {render()} */}
    </OverviewWrap>
  );
};

export default observer(RequestChart);
