import React, { useEffect } from 'react';
import { Button, Tooltip, Modal } from 'choerodon-ui/pro';
import { getRandomBackground } from '@/containers/components/c7n/util';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';
import moment from 'moment';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import { get, map } from 'lodash';
import { useStarTargetPro } from './stores';
import { useWorkBenchStore } from '../../stores';
import emptyImg from '../../../../../../images/owner.png';
import mappings from '../../stores/mappings';

import './index.less';
import AddModal from './components/addModals';

const StarTargetPro = observer(() => {
  const {
    starTargetProUseStore,
    prefixCls,
    organizationId,
  } = useStarTargetPro();

  const {
    workBenchUseStore,
    history,
    componentsDs,
    location: { search },
  } = useWorkBenchStore();

  const {
    isEdit,
    setEdit,
  } = workBenchUseStore;

  useEffect(() => {
    workBenchUseStore.setActiveStarProject(undefined);
    starTargetProUseStore.axiosGetStarProjects();
  }, [organizationId]);

  const handleClickItem = (s) => {
    const origin = starTargetProUseStore.getStarProjects;
    starTargetProUseStore.setStarProjects(
      origin.map((si) => {
        const temp = si;
        if (temp.id === s.id) {
          workBenchUseStore.setActiveStarProject(!s.active ? si : undefined);
          temp.active = !s.active;
        } else {
          temp.active = false;
        }
        return temp;
      }),
    );
  };

  const renderGroupProjects = (s) => {
    const array = s.categories || [];
    return array.map(
      (value, key) => value.code !== 'PROGRAM_PROJECT' && (
      <Tooltip title={value && value.name} placement="top">
        <span
          className={`${prefixCls}-proContainer-items-project-categories`}
        >
          {value.name}
        </span>
      </Tooltip>
      ),
    );
  };

  const renderContent = () => {
    const starProjects = starTargetProUseStore.getStarProjects;
    if (starTargetProUseStore.getLoading) {
      return (
        <div style={{ padding: '56px 0px' }} className={`${prefixCls}-content`}>
          <LoadingBar display />
        </div>
      );
    }
    if (starProjects.length === 0) {
      return (
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
    }
    return (
      <div className={`${prefixCls}-proContainer`}>
        {starProjects.slice(0, 6).map((s, sIndex) => {
          const unix = String(moment(s.creationDate).unix());
          return (
            <div
              role="none"
              className={`${prefixCls}-proContainer-items ${
                s.active ? `${prefixCls}-proContainer-focus` : ''
              }`}
              onClick={() => handleClickItem(s)}
            >
              {s.active && (
                <div className={`${prefixCls}-proContainer-items-correct`}>
                  <i
                    className={`${prefixCls}-proContainer-items-correct-icon`}
                  />
                </div>
              )}
              <div
                className={`${prefixCls}-proContainer-items-icon`}
                style={{
                  backgroundImage: s.imageUrl
                    ? `url("${s.imageUrl}")`
                    : getRandomBackground(unix.substring(unix.length - 3)),
                }}
              >
                {!s.imageUrl && s.name && s.name.slice(0, 1)}
              </div>

              <Tooltip title={`${s.name} (${s.code})`} placement="top">
                <p
                  style={{ color: s.active ? 'white' : 'rgba(58,52,95,1)' }}
                  className={`${prefixCls}-proContainer-items-text`}
                >
                  {s.name}
                  &nbsp;(
                  {s.code}
                  )
                </p>
              </Tooltip>

              <p
                style={{ color: s.active ? 'white' : 'rgba(58,52,95,0.65)' }}
                className={`${prefixCls}-proContainer-items-project`}
              >
                {renderGroupProjects(s)}
              </p>

              <div className={`${prefixCls}-proContainer-items-extra`}>
                <Tooltip title={s.createUserName} placement="top">
                  <div
                    className={`${prefixCls}-proContainer-items-extra-icon`}
                    style={{
                      backgroundImage: `url(${s.createUserImageUrl})`,
                    }}
                  >
                    {!s.createUserImageUrl
                      && s.createUserName
                      && s.createUserName.slice(0, 1)}
                  </div>
                </Tooltip>
                <div
                  className={`${prefixCls}-proContainer-items-extra-text`}
                  style={{
                    color: s.active ? 'white' : ' rgba(58, 52, 95, 0.65)',
                  }}
                >
                  <p>创建于</p>
                  <p>{s.creationDate && s.creationDate.split(' ')[0]}</p>
                </div>
                <span
                  className={`${prefixCls}-proContainer-items-project-goNext`}
                  style={{
                    background: s.active
                      ? 'rgba(255,255,255,0.12)'
                      : 'rgba(104,135,232,0.1)',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    workBenchUseStore.handleClickProject(s);
                  }}
                  role="none"
                >
                  <Icon
                    style={{ color: s.active ? 'white' : '#6887E8' }}
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

  function handleEditable() {
    setEdit(true);
  }

  function handleCancel() {
    setEdit(false);
  }

  function openAddComponents() {
    const subPrefix = 'c7ncd-workbench-addModal';
    const typeArr = map(workBenchUseStore.workComponents, (item) => item.type);
    Modal.open({
      title: '添加卡片',
      key: Modal.key(),
      drawer: true,
      style: {
        width: '740px',
      },
      children: <AddModal
        subPrefix={subPrefix}
        existTypes={typeArr}
        addComponent={(type) => {
          const {
            layout,
            ...rest
          } = mappings[type];
          const tempCp = {
            ...rest,
            layout: {
              ...layout,
              x: (typeArr.length * 2) % (12),
              y: Infinity,
              static: false,
            },
          };
          workBenchUseStore.addNewComponents(tempCp);
        }}
      />,
      className: `${subPrefix}`,
    });
  }

  function hanldeSave() {
    const tempLayout = workBenchUseStore.layouts;
    const tempComponents = map(tempLayout, (item) => {
      const {
        layout,
        ...rest
      } = mappings[get(item, 'i')];
      return {
        ...rest,
        layout: {
          ...item,
          static: true,
        },
      };
    });
    localStorage.setItem('tempComponents', JSON.stringify(tempComponents));
    componentsDs.loadData(tempComponents);
    setEdit(false);
  }

  const renderBtns = () => {
    let btnGroups;
    if (isEdit) {
      btnGroups = [
        <Button
          color="primary"
          className={`${prefixCls}-btnGroups-primary`}
          onClick={openAddComponents}
        >
          添加卡片
        </Button>,
        <Button
          color="primary"
          className={`${prefixCls}-btnGroups-primary`}
          onClick={hanldeSave}
        >
          保存
        </Button>,
        <Button
          className={`${prefixCls}-btnGroups-default`}
          color="primary"
          onClick={handleCancel}
        >
          取消
        </Button>,
      ];
    } else {
      btnGroups = [
        <Button
          color="primary"
          className={`${prefixCls}-btnGroups-default`}
          onClick={handleEditable}
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
      <p className={`${prefixCls}-name`}>星标项目</p>
      {renderBtns()}
      {renderContent()}
    </div>
  );
});

export default StarTargetPro;
