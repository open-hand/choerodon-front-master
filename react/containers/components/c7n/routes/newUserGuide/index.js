import React from 'react';
import { Button, Icon } from 'choerodon-ui';
import './index.less';
import { useHistory } from 'react-router';
import queryString from 'query-string';
import getSearchString from '@/containers/components/c7n/util/gotoSome';

function ListView(props) {
  const history = useHistory();
  const paramsObj = {
    createProject: '创建项目',
    // createUser: '邀请成员',
    // openSprint: '规划迭代',
  };
  const goAction = async (link) => {
    const queryObj = queryString.parse(history.location.search);
    const search = await getSearchString(
      'organization',
      'id',
      queryObj.organizationId,
    );
    history.push(`${link.substring(2)}${search}`);
  };
  return (
    <div className="c7n-master-newUserGuide">
      <h2>配置并开启项目之旅</h2>
      <div className="c7n-master-newUserGuide-step">
        {props.list.map((item, index) => (
          <>
            <div className="c-step">
              <div className="step-content">
                <img src={item.icon} alt="" />
                <p className="step-content-title">{item.name}</p>
                <p className="step-content-desc">{item.description}</p>
                {item.code === 'createProject' && (
                <Button
                  type="dashed"
                  onClick={() => {
                    goAction(item.operationLink);
                  }}
                >
                  {paramsObj[item.code]}
                </Button>
                )}
              </div>
            </div>
            {index + 1 !== props.list.length && (
            <div className="step-arrow">
              <Icon type="arrow_forward" />
            </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default ListView;
