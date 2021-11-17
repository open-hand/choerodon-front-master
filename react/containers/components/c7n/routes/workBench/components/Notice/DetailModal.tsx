import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'choerodon-ui';

import defaultAvatar from '@/assets/images/favicon.png';
import AppState from '@/containers/stores/c7n/AppState';
import { NoticeVO } from './model';

const ModalTitle = styled.div`
  position: relative;
  color: #5365ea;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: .16rem;
  padding-left: 0.3rem;

  &::before {
    position: absolute;
    content: "\\EBDB";
    left: 0;
    font-family: icomoon !important;
    font-size: .2rem;
    color: #f9a313;
  }
`;

const ModalSubTitle = styled.div`
  font-size: 13px;
  color: var(--text-color3);
  margin-bottom: .16rem;
`;

const ModalContent = styled.div`
  background: #f8f8f8;
  border-radius: 4px;
  padding: 20px;
  width: 100%;

  img {
    max-width: 100%;
  }
`;

export default function DetailModal(props: {item:NoticeVO}) {
  const { item } = props;
  const { systemLogo, systemName } = AppState.getSiteInfo as any;

  const realSystemLogo = systemLogo || defaultAvatar;
  // eslint-disable-next-line no-underscore-dangle
  const realSystemName = systemName || (window as any)._env_.HEADER_TITLE_NAME || 'Choerodon猪齿鱼平台';

  return (
    <>
      <ModalTitle>{item.title}</ModalTitle>
      <ModalSubTitle>
        <Avatar src={item.sendByUser?.imageUrl ?? realSystemLogo} size={18}>
          {item.sendByUser
            ? item.sendByUser.realName && item.sendByUser.realName.charAt(0)
            : realSystemName?.charAt(0)}
        </Avatar>
        <span style={{ marginLeft: 12, marginRight: 8 }}>
          {item.sendByUser ? item.sendByUser.realName : realSystemName}
        </span>
        <span style={{ marginRight: 8 }}>·</span>
        {item.sendDateFull}
      </ModalSubTitle>
      <ModalContent>
        <span
        // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </ModalContent>
    </>
  );
}
