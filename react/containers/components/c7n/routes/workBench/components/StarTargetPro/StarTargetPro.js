import React from 'react';
import {
  Button, Tooltip,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';
import moment from 'moment';
import {
  get,
} from 'lodash';
import { getRandomBackground } from '@/utils';
import handleClickProject from '@/utils/gotoProject';
import Card from '@/containers/components/c7n/routes/workBench/components/card';
import { useStarTargetPro } from './stores';
import { useWorkBenchStore } from '../../stores';
import emptyImg from '@/assets/images/owner.png';

import './index.less';

const StarTargetPro = observer(() => {
  const {
    prefixCls,
    getStarProject,
  } = useStarTargetPro();

  const {
    AppState,
    workBenchUseStore,
    history,
    location: { search },
    selectedProjectId,
    formatWorkbench,
    formatCommon,
  } = useWorkBenchStore();

  const {
    setActiveStarProject,
  } = workBenchUseStore;

  const handleClickItem = (s) => {
    const tempId = get(s, 'id');
    if (tempId === selectedProjectId) {
      setActiveStarProject(null);
      return;
    }
    setActiveStarProject(s);
  };

  const renderEmptypage = () => (
    <div className={`${prefixCls}-content`}>
      <img src={emptyImg} alt="empty" />
      <div className={`${prefixCls}-content-emptyText`}>
        <p className={`${prefixCls}-content-emptyText-emptyP`}>
          {formatWorkbench({ id: 'noStarProjects' })}
        </p>
        <p className={`${prefixCls}-content-emptyText-emptySuggest`}>
          {formatWorkbench({ id: 'noStarProjects.gotoadd' })}
        </p>
        <Button
          onClick={() => {
            history.push({
              pathname: '/projects',
              search,
            });
          }}
          funcType="raised"
          color="primary"
        >
          {formatWorkbench({ id: 'gotoProject' })}
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    const starProjects = getStarProject.slice();
    if (starProjects.length === 0) {
      return renderEmptypage();
    }
    return (
      <div className={`${prefixCls}-proContainer`}>
        {starProjects.slice(0, 6).map((s, sIndex) => {
          const unix = String(moment(s.creationDate).unix());
          const isActive = selectedProjectId === get(s, 'id');
          return (
            <div
              role="none"
              className={`${prefixCls}-proContainer-items ${
                isActive ? `${prefixCls}-proContainer-focus` : ''
              }`}
              onClick={() => handleClickItem(s)}
            >
              {/* {isActive && (
                <div className={`${prefixCls}-proContainer-items-correct`}>
                  <i
                    className={`${prefixCls}-proContainer-items-correct-icon`}
                  />
                </div>
              )} */}
              <div className={`${prefixCls}-proContainer-items-header`}>
                <div
                  className={`${prefixCls}-proContainer-items-header-icon`}
                  style={{
                    backgroundImage: s.imageUrl
                      ? `url("${s.imageUrl}")`
                      : getRandomBackground(unix.substring(unix.length - 3)),
                  }}
                >
                  {!s.imageUrl && s.name && s.name.slice(0, 1)}
                </div>
                <Tooltip title={`${s.code}`} placement="top">
                  <p
                    style={{ color: isActive ? 'white' : 'var(--text-color3)' }}
                    className={`${prefixCls}-proContainer-items-header-text`}
                  >
                    {s.code}
                  </p>
                </Tooltip>
              </div>
              <Tooltip title={`${s.name}`} placement="top">
                <div
                  className={`${prefixCls}-proContainer-items-project`}
                  style={{
                    color: isActive ? 'white' : 'var(--text-color)',
                  }}
                >
                  {s.name}
                </div>
              </Tooltip>

              <div
                className={`${prefixCls}-proContainer-items-extra`}
                role="none"
                style={{ background: isActive ? '#ECF0FC' : 'rgba(104, 135, 232, 0.12)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickProject(s, history);
                }}
              >
                <span
                  className={`${prefixCls}-proContainer-items-extra-text`}
                >
                  进入项目
                </span>
                <span
                  className={`${prefixCls}-proContainer-items-extra-goNext`}
                >
                  <Icon
                    type="trending_flat"
                  />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`${prefixCls}`}>
      <Card
        title={formatCommon({ id: 'starProjects' })}
        className={`${prefixCls}-name`}
      >
        {renderContent()}
      </Card>
    </div>
  );
});

export default StarTargetPro;
