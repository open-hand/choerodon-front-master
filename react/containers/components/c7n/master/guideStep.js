import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import './guideStep.less';
import { Icon } from 'choerodon-ui';
import { useHistory } from 'react-router';
import queryString from 'query-string';
import getSearchString from '@/containers/components/c7n/util/gotoSome';
import bg1 from '../../../images/bg1.svg';
import bg2 from '../../../images/bg2.svg';
import { WSHandler } from '@/index';

function ListView({ AppState }) {
  const history = useHistory();

  const [expand, setExpand] = useState(true);

  useEffect(() => {
    async function loadUserWizardStatus() {
      await AppState.loadUserWizardStatus(
        AppState.currentMenuType.organizationId,
      );
    }
    loadUserWizardStatus();
  }, []);

  const expandChange = () => {
    setExpand(!expand);
  };
  const goAction = async (link) => {
    const queryObj = queryString.parse(history.location.search);
    const search = await getSearchString('organization', 'id', queryObj.organizationId);
    history.push(`${link.substring(2)}${search}`);
  };

  const handleMessage = (d, k) => {
    // if (k === 'star-projects') {
    //   AppState.setStarProject(Jsonbig.parse(d));
    // } else {
    //   AppState.setRecentUse(Jsonbig.parse(d).map((i: any) => i.projectDTO));
    // }
  };

  return AppState.getUserWizardStatus ? (
    <div
      className="c7ncd-footer-guideStep"
      style={expand ? { height: 120 } : { height: 0 }}
    >
      <div
        className="c7ncd-footer-guideStep-content"
        style={expand ? { display: 'flex' } : { display: 'none' }}
      >
        {AppState.getUserWizardStatus.map((item) => (
          <div className="step">
            <img src={item.status === 'uncompleted' ? bg2 : bg1} alt="" />
            <span className="step-text">
              {item.status === 'uncompleted' ? `待完成${item.name}` : `已完成${item.name}`}
              {item.status === 'uncompleted' && item.enableClick && <span role="none" onClick={() => { goAction(item.operationLink); }} className="step-goaction">去完成</span>}
            </span>
          </div>
        ))}
      </div>
      <div className="icon-div" role="none" onClick={expandChange}>
        <Icon
          type="expand_more"
          className="icon-div-icon"
          style={
            expand
              ? { transform: 'rotate(180deg)' }
              : { transform: 'rotate(0deg)' }
          }
        />
      </div>
      <WSHandler
        messageKey="xxxx"
        onMessage={(data) => handleMessage(data, 'xxxx')}
      >
        <>
        </>
      </WSHandler>
    </div>
  ) : null;
}

export default withRouter(inject('AppState')(observer(ListView)));
