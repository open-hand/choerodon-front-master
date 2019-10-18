/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import TimeAgo from 'timeago-react';
import { withRouter } from 'react-router-dom';
import onClickOutside from 'react-onclickoutside';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Badge, Button, Icon, Spin, Tabs, Avatar, Tooltip } from 'choerodon-ui';
import { Button as ButtonPro } from 'choerodon-ui/pro';
import WSHandler from '../../tools/ws/WSHandler';
import defaultAvatar from './style/icons/favicon.png';
import { getCookie } from '../../../../common';

const { TabPane } = Tabs;
const PREFIX_CLS = 'c7n';
const prefixCls = `${PREFIX_CLS}-boot-header-inbox`;

/* eslint-disable-next-line */
const reg = /\n|&nbsp;|&lt|&gt|<[^a\/][^>]*>|<\/[^a][^>]*>/g;
const iconMap = {
  msg: 'textsms',
  notice: 'notifications',
};

@inject('HeaderStore', 'AppState')
@onClickOutside
@observer
class RenderPopoverContentClass extends Component {
  handleClickOutside = () => {
    const { HeaderStore } = this.props;
    HeaderStore.setInboxVisible(false);
    setTimeout(() => {
      HeaderStore.setInboxDetailVisible(false);
    }, 700);
  };
  
  render() {
    const { HeaderStore, inboxData, inboxLoading, renderMessages, handleVisibleChange, cleanAllMsg, handleSettingReceive, readAllMsg } = this.props;
    const { inboxVisible, getUnreadAll, announcementClosed, getUnreadMsg, getUnreadNotice, getUnreadOther } = HeaderStore;
    const siderClasses = classNames({
      [`${prefixCls}-sider`]: true,
      [`${prefixCls}-sider-visible`]: inboxVisible,
      [`${prefixCls}-sider-move-down`]: !announcementClosed,
    });
    const operations = (
      <React.Fragment>
        <Tooltip title="全部已读"><ButtonPro funcType="flat" icon="all_read" color="primary" onClick={readAllMsg} /></Tooltip>
        <Tooltip title="接收设置"><ButtonPro funcType="flat" icon="settings" color="primary" onClick={handleSettingReceive} style={{ marginLeft: '.04rem' }} /></Tooltip>
        <Tooltip title="全部清除"><ButtonPro funcType="flat" icon="delete_sweep" color="primary" onClick={cleanAllMsg} style={{ marginLeft: '.04rem' }} /></Tooltip>
      </React.Fragment>
    );
    return (
      <div className={siderClasses}>
        <div className={`${prefixCls}-sider-header-wrap no-mr ${!inboxData.length ? 'is-empty' : null}`} style={{ disable: 'flex', flexDirection: 'column' }}>
          <div className={`${prefixCls}-sider-header`}>
            <div className={`${prefixCls}-sider-header-title`}>
              <span className="msgTitle">消息通知</span>
              <Button
                funcType="flat"
                type="primary"
                icon="close"
                shape="circle"
                onClick={() => handleVisibleChange(!inboxVisible)}
              />
            </div>
            <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
              <TabPane
                tab={<span><Badge count={getUnreadMsg.filter(v => !v.read).length} style={{ transform: 'scale(.75)' }}>消息</Badge></span>}
                key="1"
              >
                <Spin spinning={inboxLoading}>
                  {renderMessages(getUnreadMsg)}
                </Spin>
              </TabPane>
              <TabPane
                tab={<span><Badge count={getUnreadNotice.filter(v => !v.read).length} style={{ transform: 'scale(.75)' }}>通知</Badge></span>}
                key="2"
              >
                <Spin spinning={inboxLoading}>
                  {renderMessages(getUnreadNotice)}
                </Spin> 
              </TabPane>
              <TabPane tab="公告" key="3">
                <Spin spinning={inboxLoading}>
                  {renderMessages(getUnreadOther)}
                </Spin>
              </TabPane>
            </Tabs>
          </div>
        </div>
        <RenderPopoverContentDetailClass
          handleVisibleChange={this.handleVisibleChange}
        />
      </div>
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
    const { HeaderStore, AppState, inboxData, inboxLoading, renderMessages, handleVisibleChange, cleanAllMsg } = this.props;
    const { inboxDetailVisible, getUnreadAll, announcementClosed, getUnreadMsg, getUnreadNotice, inboxDetail } = HeaderStore;
    const { systemLogo, systemName } = AppState.getSiteInfo;
    const realSystemLogo = systemLogo || defaultAvatar;
    // eslint-disable-next-line no-underscore-dangle
    const realSystemName = systemName || window._env_.HEADER_TITLE_NAME || 'Choerodon猪齿鱼平台';
    const siderClasses = classNames({
      [`${prefixCls}-sider-no-animate`]: true,
      [`${prefixCls}-sider`]: true,
      [`${prefixCls}-sider-visible`]: inboxDetailVisible,
      [`${prefixCls}-sider-move-down`]: !announcementClosed,
    });
    if (!inboxDetail) return null;
    const realSendTime = 'sendDate' in HeaderStore.inboxDetail ? HeaderStore.inboxDetail.sendDate : HeaderStore.inboxDetail.sendTime;
    if (!inboxDetailVisible) {
      return null;
    }
    return (
      <div className={siderClasses} style={{ zIndex: '20' }}>
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
                <Icon type={iconMap[HeaderStore.inboxDetail.type] || 'volume_up'} style={{ marginRight: 10 }} />
                <a onClick={e => {}}>{HeaderStore.inboxDetail.title}</a>
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
                  <TimeAgo
                    datetime={realSendTime.slice(0, realSendTime.length - 3)}
                    locale="zh_CN"
                  />
                )
              }
            </div>
            {/* <div className="content">
              <p dangerouslySetInnerHTML={{ __html: `${HeaderStore.inboxDetail.content.replace(reg, '')}` }} />
            </div> */}
            <div className="content c7n-boot-header-inbox-wrap">
              <div
                className="c7n-boot-header-inbox-content"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: `${HeaderStore.inboxDetail.content}` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

@withRouter
@inject('HeaderStore', 'AppState')
@observer
export default class Inbox extends Component {
  cleanMsg = (e, data) => {
    e.stopPropagation();
    const { AppState, HeaderStore } = this.props;
    HeaderStore.readMsg(AppState.userInfo.id, data);
  };

  deleteMsg = (e, data) => {
    e.stopPropagation();
    const { AppState, HeaderStore } = this.props;
    HeaderStore.deleteMsg(AppState.userInfo.id, data);
  };

  readAllMsg = () => {
    const { AppState, HeaderStore } = this.props;
    HeaderStore.readMsg(AppState.userInfo.id);
    // HeaderStore.setInboxVisible(false);
  };
  
  cleanAllMsg = () => {
    const { AppState, HeaderStore } = this.props;
    HeaderStore.deleteMsg(AppState.userInfo.id);
    // HeaderStore.setInboxVisible(false);
  };

  getUnreadMsg() {
    const { AppState, HeaderStore } = this.props;
    HeaderStore.axiosGetUserMsg(AppState.getUserId);
    HeaderStore.axiosGetStick();
  }

  openSettings = () => {
    const { history, AppState } = this.props;
    history.push(`/notify/receive-setting?type=site&orgId=${AppState.currentMenuType.orgId}`);
  };

  handleButtonClick = () => {
    const { HeaderStore } = this.props;
    if (!HeaderStore.inboxLoaded) {
      HeaderStore.setInboxLoading(true);
      this.getUnreadMsg();
    }
    this.handleVisibleChange(!HeaderStore.inboxVisible);
  };

  handleMessage = () => {
    this.props.HeaderStore.setInboxLoaded(false);
  };

  handleMessageClick = (e) => {
    this.handleVisibleChange(false);
  };

  handleMessageTitleClick = (e, data) => {
    // set as read && go to message detail
    this.cleanMsg(e, data);
    // window.open(`/#/notify/user-msg?type=site&msgId=${data.id}&msgType=${data.type}`);
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
    const { AppState } = this.props;
    if (inboxData.length > 0) {
      return (
        <ul>
          {
            inboxData.map((data) => {
              const { title, content, id, sendByUser, type, sendTime, read, sendDate } = data;
              const realSendTime = 'sendDate' in data ? sendDate : sendTime;
              const icon = <Icon type={iconMap[data.type] || 'volume_up'} className="color-blue" />;
              const iconWithBadge = read || !type ? icon : <Badge dot>{icon}</Badge>;
              let showPicUrl;
              if (content.indexOf('<img') !== -1) {
                showPicUrl = content.slice(content.indexOf('<img src="') + '<img src="'.length, content.indexOf('">', content.indexOf('<img src="')));
              }
              return (
                <li className={`${prefixCls}-sider-content-list`} key={data.id}>
                  <div className={`${prefixCls}-sider-content-list-title`}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {iconWithBadge}
                      <a onClick={e => this.handleMessageTitleClick(e, data)} style={{ marginLeft: 10 }}>{title}</a>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: 'rgba(0, 0, 0, 0.54)' }}>
                      {
                        new Date() - new Date(realSendTime) >= 172800000 ? (
                          <span>{realSendTime}</span>
                        ) : (
                          <TimeAgo
                            datetime={realSendTime.slice(0, realSendTime.length - 3)}
                            locale="zh_CN"
                          />
                        )
                      }
                      {
                        data.type ? (
                          <Icon
                            type="close"
                            style={{ cursor: 'pointer', marginLeft: 12, fontSize: '20px' }}
                            onClick={e => this.deleteMsg(e, data)}
                          />
                        ) : null
                      }
                    </div>
                  </div>
                  <div className={`${prefixCls}-sider-content-list-description`}>
                    <div style={{ maxHeight: 63, overflow: 'hidden' }}>
                      <p id={`li-${id}`} dangerouslySetInnerHTML={{ __html: `${content.replace(reg, '')}` }} />
                      {document.querySelector(`#li-${id}`) && document.querySelector(`#li-${id}`).offsetHeight > 63 ? (
                        <a href="#" target="_blank" rel="noreferrer noopener">
                          <span>了解更多</span>
                          <Icon type="open_in_new" />
                        </a>
                      ) : null}
                    </div>
                    {showPicUrl ? (
                      // eslint-disable-next-line jsx-a11y/alt-text
                      <img style={{ maxWidth: '100%', marginTop: 10 }} src={showPicUrl.replace(/&amp;/g, '&')} />
                    ) : null}
                  </div>
                  {/* <div className={`${prefixCls}-sider-content-list-time`}>
                    <TimeAgo
                      datetime={sendTime.slice(0, sendTime.length - 3)}
                      locale="zh_CN"
                    />
                  </div> */}
                </li>
              );
            })
          }
        </ul>
      );
    } else {
      return (
        <div className={`${prefixCls}-empty`}>
          暂时没有站内消息
        </div>
      );
    }
  }

  render() {
    const { AppState, HeaderStore: { inboxData, inboxLoading } } = this.props;
    const popOverContent = { inboxData, inboxLoading };
    return (
      <React.Fragment>
        <WSHandler
          messageKey={`choerodon:msg:site-msg:${AppState.userInfo.id}`}
          path={`choerodon/msg?token=${getCookie('access_token')}`}
          onMessage={this.handleMessage}
          type="site-msg"
        >
          {
            data => (
              <Badge onClick={this.handleButtonClick} className={`${prefixCls} ignore-react-onclickoutside`} count={data || 0}>
                <Button functype="flat" shape="circle" style={{ color: '#fff' }}>
                  <Icon type="notifications" />
                </Button>
              </Badge>
            )
          }
        </WSHandler>
        <RenderPopoverContentClass
          {...popOverContent}
          cleanAllMsg={this.cleanAllMsg}
          renderMessages={this.renderMessages}
          handleVisibleChange={this.handleVisibleChange}
          handleSettingReceive={this.openSettings}
          readAllMsg={this.readAllMsg}
        />
        
      </React.Fragment>
    );
  }
}
