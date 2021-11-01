import React from 'react';
import {
  Button, Tooltip, Modal, Spin,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';
import moment from 'moment';
import {
  get, map, forEach, filter,
} from 'lodash';
import { useQueryString } from '@choerodon/components';
import { getRandomBackground } from '@/containers/components/c7n/util';
import handleClickProject from '@/containers/components/util/gotoProject';
import Card from '@/containers/components/c7n/routes/workBench/components/card';
import AddModal from '@/containers/components/c7n/components/addComponentsModal';
import { getListIsCurrentOrg } from '../../../../ui/header/components/ProjectSelector';
import { useStarTargetPro } from './stores';
import { useWorkBenchStore } from '../../stores';
import emptyImg from '@/assets/images/owner.png';
import mappings from '../../stores/mappings';

import './index.less';

const StarTargetPro = observer(() => {
  const {
    prefixCls,
    getStarProject,
  } = useStarTargetPro();

  const { organizationId } = useQueryString();

  const {
    AppState,
    workBenchUseStore,
    history,
    componentsDs,
    location: { search },
    selectedProjectId,
    allowedModules,
  } = useWorkBenchStore();

  const {
    isEdit,
    setEdit,
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
        <p className={`${prefixCls}-content-emptyText-emptyP`}>暂无星标</p>
        <p className={`${prefixCls}-content-emptyText-emptySuggest`}>
          您还没有星标项目，请前往&quot;项目管理&quot;页面进行添加
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
          转到项目管理
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
      <Spin spinning={getListIsCurrentOrg(starProjects, [], organizationId)}>
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
                {isActive && (
                <div className={`${prefixCls}-proContainer-items-correct`}>
                  <i
                    className={`${prefixCls}-proContainer-items-correct-icon`}
                  />
                </div>
                )}
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
                {/* <ProjectCategory
                data={s.categories}
                showIcon={false}
                style={{ color: isActive ? 'white' : 'rgba(58,52,95,0.65)' }}
                className={`${prefixCls}-proContainer-items-project`}
              /> */}
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
                    handleClickProject(s, history, AppState);
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
      </Spin>
    );
  };

  function handleEditable() {
    setEdit(true);
  }

  function handleCancel() {
    componentsDs.loadData(workBenchUseStore.initData);
    setEdit(false);
  }

  function addComponent(newTypeArr, deleteArr) {
    const existData = map(componentsDs.filter((record) => !deleteArr.includes(record.get('i'))), (record) => record.toData());
    forEach(newTypeArr, (type) => {
      const {
        layout,
      } = mappings[type];
      const tempCp = {
        ...layout,
        x: 0,
        y: Infinity,
      };
      existData.push(tempCp);
    });
    componentsDs.loadData(existData);
  }

  function openAddComponents() {
    const subPrefix = 'c7ncd-workbench-addModal';
    const typeArr = map(componentsDs.toData(), (item) => get(item, 'i'));
    Modal.open({
      title: '添加卡片',
      key: Modal.key(),
      drawer: true,
      style: {
        width: '740px',
      },
      contentStyle: { padding: 0 },
      children: <AddModal
        subPrefix={subPrefix}
        existTypes={typeArr}
        addComponent={addComponent}
        mappings={allowedModules.map((item) => (
          mappings[item]
        ))}
      />,
      className: `${subPrefix}`,
    });
  }

  function hanldeSave() {
    const tempData = componentsDs.toData();
    workBenchUseStore.setInitData(tempData);
    workBenchUseStore.saveConfig(tempData);
    setEdit(false);
  }

  function handleResetModal() {
    Modal.open({
      title: '重置工作台',
      children: '确认重置工作台吗？',
      onOk: handleReset,
      okProps: {
        color: 'red',
      },
      cancelProps: {
        color: 'dark',
      },
    });
  }

  function handleReset() {
    const defaultValues = map(filter(mappings, (item) => item.type !== 'backlogApprove'), (item) => item.layout);
    componentsDs.loadData(defaultValues);
  }

  const renderBtns = () => {
    let btnGroups;
    if (isEdit) {
      btnGroups = [
        <Button
          key="1"
          onClick={openAddComponents}
          icon="settings-o"
        >
          卡片配置
        </Button>,
        <Button
          key="2"
          onClick={hanldeSave}
        >
          保存
        </Button>,
        <Button
          key="3"
          onClick={handleResetModal}
        >
          重置
        </Button>,
        <Button
          key="4"
          onClick={handleCancel}
          color="primary"
        >
          取消
        </Button>,
      ];
    } else {
      btnGroups = [
        <Button
          key="5"
          onClick={handleEditable}
          icon="settings-o"
          color="primary"
        >
          工作台配置
        </Button>,
      ];
    }
    return (
      <div
        className={`${prefixCls}-btnGroups`}
      >
        {btnGroups}
      </div>
    );
  };
  return (
    <div className={`${prefixCls}`}>
      <Card
        title="星标项目"
        className={`${prefixCls}-name`}
      >
        {renderContent()}
      </Card>
      {/* <p className={`${prefixCls}-name`}>星标项目</p> */}
      {/* {renderBtns()} */}
    </div>
  );
});

export default StarTargetPro;
