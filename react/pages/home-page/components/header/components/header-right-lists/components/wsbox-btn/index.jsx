/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { withRouter } from 'react-router-dom';
import onClickOutside from 'react-onclickoutside';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import ScrollContext from 'react-infinite-scroll-component';
import {
  Badge, Button, Tabs, Avatar, Tooltip, notification,
} from 'choerodon-ui';
import {
  Button as ButtonPro, Modal, Icon, Spin, Switch,
} from 'choerodon-ui/pro';
import JSONBig from 'json-bigint';
import { TimePopover } from '@zknow/components';
import axios from '@/components/axios';
import Action from '@/components/action';
import WSHandler from '@/components/ws/WSHandler';
import defaultAvatar from '@/assets/images/favicon.png';
import styles from './styles.less';
import './index.less';
import headerStore from '@/containers/stores/c7n/HeaderStore';

const { TabPane } = Tabs;
const PREFIX_CLS = 'c7n';
const prefixCls = `${PREFIX_CLS}-boot-header-inbox`;

/* eslint-disable-next-line */
const reg = /\n|&nbsp;|&lt|&gt|<[^a\/][^>]*>|<\/[^a][^>]*>/g;
const imgreg = /(<img[\s\S]*?src\s*=\s*["|']|\[img\])(.*?)(["|'][\s\S]*?>|\[\/img\])/;
const tablereg = /<table(.*?)>([^]*?)<\/table>/g;
const detailLinkReg = /<a(.*?)>查看详情<\/a>/g;
const cleanModalKey = Modal.key();
const orgReg = /\${orgString}/;

@inject('HeaderStore', 'AppState')
@onClickOutside
@observer
class RenderPopoverContentClass extends Component {
  handleGetUnreadStatus = async () => {
    const {
      HeaderStore,
    } = this.props;
    const res = await axios({
      method: 'get',
      url: '/hmsg/choerodon/v1/messages/unread/setting',
    });
    HeaderStore.setUnReadStatus(res);
  }

  componentDidMount() {
    this.handleGetUnreadStatus();
  }

  handleClickOutside = () => {
    const { HeaderStore } = this.props;
    if (HeaderStore.inboxVisible) {
      HeaderStore.setInboxVisible(false);
      HeaderStore.axiosGetUnreadMessageCount();
      setTimeout(() => {
        HeaderStore.setInboxDetailVisible(false);
      }, 700);
    }
  };

  handleChangeUnreadStatus = async (value) => {
    const {
      HeaderStore,
      AppState,
    } = this.props;
    await axios({
      method: 'post',
      url: `/hmsg/choerodon/v1/messages/unread/setting?only_unread_flag=${value}`,
    });
    HeaderStore.setUnReadStatus(value);
    HeaderStore.axiosGetUserMsg(AppState.getUserId, value);
  }

  render() {
    const {
      HeaderStore, inboxData, inboxLoading, renderMessages, handleVisibleChange, openCleanAllModal, handleSettingReceive, readAllMsg, AppState,
    } = this.props;
    const {
      inboxVisible, getUnreadMsg, getUnreadOther,
    } = HeaderStore;
    const siderClasses = classNames({
      [`${prefixCls}-sider`]: true,
      [`${prefixCls}-sider-visible`]: inboxVisible,
      // [`${prefixCls}-sider-move-down`]: !announcementClosed,
    });
    const operations = (
      <>
        <span className={styles.c7ncd_onlyUnread}>
          仅显示未读
        </span>
        <Switch
          checked={HeaderStore.getUnReadStatus}
          onChange={this.handleChangeUnreadStatus}
        />
        <Action
          className={styles.c7ncd_operationAction}
          data={[{
            text: '全部已读',
            action: readAllMsg,
          }, {
            text: '接收设置',
            action: handleSettingReceive,
          }, {
            text: '全部清除',
            action: openCleanAllModal,
          }]}
        />
        {/* <Tooltip title="全部已读"><ButtonPro funcType="flat" icon="all_read" color="primary" onClick={readAllMsg} /></Tooltip>
        <Tooltip title="接收设置"><ButtonPro funcType="flat" icon="settings" color="primary" onClick={handleSettingReceive} style={{ marginLeft: '.04rem' }} /></Tooltip>
        {HeaderStore.getInboxActiveKey === '1' && (<Tooltip title="全部清除"><ButtonPro funcType="flat" icon="delete_sweep" color="primary" onClick={openCleanAllModal} style={{ marginLeft: '.04rem' }} /></Tooltip>)} */}
      </>
    );

    const loadMore = () => {
      headerStore.setUserMsgcurrentSize(headerStore.userMsgcurrentSize + 200);
      headerStore.axiosGetUserMsg(AppState.getUserId, headerStore.getUnReadStatus);
    };

    return (
      createPortal(
        <div className={siderClasses}>
          <div className={`${prefixCls}-sider-header-wrap no-mr ${!inboxData.length ? 'is-empty' : null}`} style={{ disable: 'flex', flexDirection: 'column' }}>
            <div className={`${prefixCls}-sider-header`}>
              <div className={`${prefixCls}-sider-header-title`}>
                <span className="msgTitle">消息通知</span>
                <Button
                  funcType="flat"
                  icon="close"
                  shape="circle"
                  onClick={() => {
                    handleVisibleChange(!inboxVisible);
                    HeaderStore.axiosGetUnreadMessageCount();
                  }}
                />
              </div>
              <Tabs
                defaultActiveKey="1"
                activeKey={HeaderStore.getInboxActiveKey}
                onChange={(flag) => HeaderStore.setInboxActiveKey(flag)}
                tabBarExtraContent={operations}
              >
                <TabPane
                  tab={<span><Badge count={getUnreadMsg.filter((v) => !v.read).length} style={{ transform: 'scale(.75)' }}>消息</Badge></span>}
                  key="1"
                  className={`${prefixCls}-sider-pane-usermsg`}
                >
                  <ScrollContext
                    dataLength={HeaderStore.userMsgCount}
                    next={loadMore}
                    hasMore={HeaderStore.userMsghaveMore}
                    height="100%"
                  >
                    {renderMessages(getUnreadMsg)}
                  </ScrollContext>
                </TabPane>
                <TabPane tab="公告" key="3">
                  <Spin spinning={inboxLoading} className={`${prefixCls}-sider-header-loading`}>
                    {renderMessages(getUnreadOther)}
                  </Spin>
                </TabPane>
              </Tabs>
            </div>
          </div>
          <RenderPopoverContentDetailClass
            handleVisibleChange={this.handleVisibleChange}
          />
        </div>,
        document.body,
      )
    );
  }
}

@inject('HeaderStore', 'AppState')
// @onClickOutside
@observer
class RenderPopoverContentDetailClass extends Component {
  handleClickOutside = () => {
    const { HeaderStore } = this.props;
    HeaderStore.setInboxVisible(false);
    setTimeout(() => {
      HeaderStore.setInboxDetailVisible(false);
    }, 700);
  };

  render() {
    const {
      HeaderStore, AppState,
    } = this.props;
    const {
      inboxDetailVisible, inboxDetail,
    } = HeaderStore;
    const { systemLogo, systemName } = AppState.getSiteInfo;
    const realSystemLogo = systemLogo || defaultAvatar;
    // eslint-disable-next-line no-underscore-dangle
    const realSystemName = systemName || window._env_.HEADER_TITLE_NAME || 'Choerodon猪齿鱼平台';
    const siderClasses = classNames({
      [`${prefixCls}-sider-no-animate`]: true,
      [`${prefixCls}-sider`]: true,
      [`${prefixCls}-sider-visible`]: inboxDetailVisible,
      // [`${prefixCls}-sider-move-down`]: !announcementClosed,
    });
    if (!inboxDetail) return null;
    const realSendTime = 'sendDate' in HeaderStore.inboxDetail ? HeaderStore.inboxDetail.sendDate : HeaderStore.inboxDetail.sendTime;
    const isMsg = 'backlogFlag' in HeaderStore.inboxDetail;
    if (!inboxDetailVisible) {
      return null;
    }
    return (
      <div className={siderClasses}>
        <div className={`${prefixCls}-sider-header-wrap`}>
          <div className="header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ButtonPro
                funcType="flat"
                icon="keyboard_backspace"
                color="primary"
                style={{ marginLeft: '-5px', marginRight: '2px' }}
                onClick={() => {
                  HeaderStore.setInboxDetailVisible(false);
                }}
              />
              <span className="title">通知详情</span>
            </div>
            <ButtonPro
              funcType="flat"
              icon="close"
              className="close-button"
              onClick={() => {
                HeaderStore.setInboxVisible(false);
                setTimeout(() => {
                  HeaderStore.setInboxDetailVisible(false);
                }, 700);
              }}
            />
          </div>
          <div className="body">
            <div className="title">
              <span>
                <Icon type={isMsg ? 'textsms' : 'volume_up'} style={{ marginRight: 10 }} />
                <a>{HeaderStore.inboxDetail.title}</a>
              </span>
            </div>
            <div className="info">
              <Avatar src={HeaderStore.inboxDetail.sendByUser ? HeaderStore.inboxDetail.sendByUser.imageUrl : realSystemLogo} size={18}>
                {HeaderStore.inboxDetail.sendByUser
                  ? HeaderStore.inboxDetail.sendByUser.realName && HeaderStore.inboxDetail.sendByUser.realName.charAt(0)
                  : realSystemName && realSystemName.charAt(0)}
              </Avatar>
              <span style={{ marginLeft: 8, marginRight: 8 }}>
                {HeaderStore.inboxDetail.sendByUser ? HeaderStore.inboxDetail.sendByUser.realName : realSystemName}
              </span>
              <span style={{ marginRight: 8 }}>·</span>
              {
                new Date() - new Date(realSendTime) >= 172800000 ? (
                  <span>{realSendTime}</span>
                ) : (
                  <TimePopover content={realSendTime} />
                )
              }
            </div>
            <div className="content c7n-boot-header-inbox-wrap">
              <div
                className="c7n-boot-header-inbox-content"
                dangerouslySetInnerHTML={{ __html: `${HeaderStore.inboxDetail.content}` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const subPrefix = 'c7ncd-wsbox-btn';

@withRouter
@inject('HeaderStore', 'AppState')
@observer
export default class Inbox extends Component {
  componentDidMount() {
    const { HeaderStore } = this.props;
    HeaderStore.axiosGetUnreadMessageCount();
  }

  cleanMsg = (e, data) => {
    e && e.stopPropagation();
    const { AppState, HeaderStore } = this.props;
    HeaderStore.readMsg(AppState.userInfo.id, data, 0);
  };

  deleteMsg = (e, data) => {
    e.stopPropagation();
    const { AppState, HeaderStore } = this.props;
    HeaderStore.deleteMsg(AppState.userInfo.id, data);
  };

  readAllMsg = () => {
    const { AppState, HeaderStore } = this.props;
    HeaderStore.readMsg(AppState.userInfo.id, null, 1);
    // HeaderStore.setInboxVisible(false);
  };

  cleanAllMsg = () => {
    const { AppState, HeaderStore } = this.props;
    HeaderStore.cleanAllMsg(AppState.userInfo.id);
  };

  openCleanAllModal = () => {
    Modal.open({
      key: cleanModalKey,
      title: '全部清除',
      children: <span>确定要彻底清除所有消息吗？清除后您将无法查看到这些消息</span>,
      okText: '清除',
      onOk: this.cleanAllMsg,
      className: 'ignore-react-onclickoutside',
    });
  };

  getUnreadMsg() {
    const { AppState, HeaderStore } = this.props;
    HeaderStore.axiosGetUserMsg(AppState.getUserId, HeaderStore.getUnReadStatus);
    HeaderStore.axiosGetStick();
  }

  openSettings = () => {
    const { history, AppState } = this.props;
    history.push(`/notify/receive-setting/project?type=user&organizationId=${AppState.currentMenuType.organizationId}`);
  };

  handleButtonClick = () => {
    const { HeaderStore } = this.props;
    if (!HeaderStore.inboxLoaded) {
      HeaderStore.setInboxLoading(true);
      this.getUnreadMsg();
    }
    this.handleVisibleChange(!HeaderStore.inboxVisible);
  };

  handleMessage = (data) => {
    const { HeaderStore } = this.props;
    const newData = JSONBig.parse(data);
    const count = HeaderStore.getUnreadMessageCount + (newData ? newData.number : 0) || 0;
    HeaderStore.setUnreadMessageCount(count < 0 ? 0 : count);
    this.props.HeaderStore.setInboxLoaded(false);
  };

  handleMessagePopClick = async (messageId) => {
    const { HeaderStore } = this.props;
    notification.close(`msg-${messageId}`);
    HeaderStore.notificationKeyList?.delete(`msg-${messageId}`);
    this.handleButtonClick();
    if (!messageId) {
      return;
    }
    try {
      const res = await HeaderStore.loadMsgDetail(messageId);
      if (res) {
        setTimeout(() => {
          this.handleMessageTitleClick(null, res);
        }, 700);
      }
    } catch (error) {
      // return false
    }
  };

  handleMessagePop = (data) => {
    const { HeaderStore } = this.props;
    const newData = JSONBig.parse(data);
    const content = newData && newData.content && (
      <p
        className={`${prefixCls}-sider-content-list-description-text`}
        dangerouslySetInnerHTML={{ __html: `${newData.content.replace(imgreg, '[图片]').replace(tablereg, '').replace(reg, '').replace(detailLinkReg, '')}` }}
      />
    );
    const notificationKey = `msg-${newData?.messageId}`;
    HeaderStore.notificationKeyList?.add(notificationKey);
    notification.info({
      key: notificationKey,
      message: (
        <span role="none" onClick={() => this.handleMessagePopClick(newData?.messageId)}>
          {newData && newData.title}
        </span>
      ),
      description: content,
      duration: 5,
      onClose: () => {
        HeaderStore.notificationKeyList?.delete(notificationKey);
      },
    });
  };

  handleCloseAllNotification = () => {
    const { HeaderStore } = this.props;
    HeaderStore.notificationKeyList?.forEach((value) => {
      notification.close(value);
    });
    HeaderStore.notificationKeyList?.clear();
  };

  handleMessageClick = (e) => {
    this.handleVisibleChange(false);
  };

  handleMessageTitleClick = (e, data) => {
    this.cleanMsg(e, data);
    const { HeaderStore } = this.props;
    HeaderStore.setInboxDetailVisible(true);
    HeaderStore.setInboxDetail(data);
  }

  handleVisibleChange = (visible) => {
    const { HeaderStore } = this.props;
    HeaderStore.setInboxVisible(visible);
    if (!visible) {
      HeaderStore.setInboxDetailVisible(visible);
    }
  };

  renderMessages = (inboxData) => {
    const { HeaderStore } = this.props;
    if (inboxData.length > 0) {
      const org = HeaderStore?.getOrgData?.[0];
      return (
        <ul height="100%">
          {
            inboxData.map((data) => {
              const {
                title, content, id, sendTime, read, sendDate,
              } = data;
              const realSendTime = 'sendDate' in data ? sendDate : sendTime;
              const isMsg = 'messageId' in data;
              const icon = <Icon type={isMsg ? 'textsms' : 'volume_up'} className="color-blue" />;
              const iconWithBadge = read || !isMsg ? icon : <Badge dot>{icon}</Badge>;
              const imageMatch = content.match(imgreg);
              const showPicUrl = imageMatch && imageMatch.length > 0 ? imageMatch[2] : undefined;
              return (
                <li className={`${prefixCls}-sider-content-list`} key={data.id}>
                  <div className={`${prefixCls}-sider-content-list-title`}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {iconWithBadge}
                      <a role="none" onClick={(e) => this.handleMessageTitleClick(e, data)} style={{ marginLeft: 10 }}>{title}</a>
                    </span>
                    <div style={{
                      display: 'flex', alignItems: 'center', flexShrink: 0, color: 'var(--text-color4)',
                    }}
                    >
                      {
                        new Date() - new Date(realSendTime) >= 172800000 ? (
                          <span>{realSendTime}</span>
                        ) : (
                          <TimePopover content={realSendTime} />
                        )
                      }
                      {
                        isMsg ? (
                          <Icon
                            type="close"
                            style={{ cursor: 'pointer', marginLeft: 12, fontSize: '20px' }}
                            onClick={(e) => this.deleteMsg(e, data)}
                          />
                        ) : null
                      }
                    </div>
                  </div>
                  <div className={`${prefixCls}-sider-content-list-description`}>
                    <div style={{ maxHeight: 84, overflow: 'hidden' }}>
                      {content && (
                        <p
                          id={`li-${id}`}
                          className={`${prefixCls}-sider-content-list-description-text`}
                          dangerouslySetInnerHTML={{ __html: `${content.replace(tablereg, '').replace(orgReg, `organizationId=${org?.id}`)}` }}
                        />
                      )}
                      {document.getElementById(`#li-${id}`) && document.getElementById(`#li-${id}`).offsetHeight > 63 ? (
                        <a href="#" target="_blank" rel="noreferrer noopener">
                          <span>了解更多</span>
                          <Icon type="open_in_new" />
                        </a>
                      ) : null}
                    </div>
                    {showPicUrl ? (
                      <img style={{ maxWidth: '100%', marginTop: 10 }} src={showPicUrl.replace(/&amp;/g, '&')} />
                    ) : null}
                  </div>
                </li>
              );
            })
          }
        </ul>
      );
    }
    return (
      <div className={`${prefixCls}-empty`}>
        暂时没有站内消息
      </div>
    );
  }

  render() {
    const {
      HeaderStore: {
        inboxData, inboxLoading, getUnreadMessageCount, notificationKeyList,
      },
    } = this.props;
    const popOverContent = { inboxData, inboxLoading };
    return (
      <div className="c7ncd-header-right-lists-item">
        <WSHandler
          messageKey="hzero-web"
          onMessage={this.handleMessage}
        >
          <Badge
            onClick={this.handleButtonClick}
            count={getUnreadMessageCount}
            className={subPrefix}
          >
            <Icon className={`${subPrefix}-icon`} type="notifications_none" />
          </Badge>
        </WSHandler>
        <WSHandler
          messageKey="choerodon-pop-ups"
          onMessage={this.handleMessagePop}
        >
          {() => <></>}
        </WSHandler>
        <RenderPopoverContentClass
          {...popOverContent}
          cleanAllMsg={this.cleanAllMsg}
          renderMessages={this.renderMessages}
          handleVisibleChange={this.handleVisibleChange}
          handleSettingReceive={this.openSettings}
          readAllMsg={this.readAllMsg}
          openCleanAllModal={this.openCleanAllModal}
        />
        {notificationKeyList?.size > 2 ? createPortal((
          <div className={`${prefixCls}-notification-all`}>
            <span>
              共有
              {notificationKeyList?.size}
              条通知
            </span>
            <Button onClick={this.handleCloseAllNotification}>关闭全部</Button>
          </div>
        ), document.body) : null}
      </div>
    );
  }
}
