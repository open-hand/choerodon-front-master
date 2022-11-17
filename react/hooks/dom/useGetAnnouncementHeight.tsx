import React from 'react';
import stores from '@/containers/stores';

// @ts-ignore
const { HeaderStore } = stores;
/**
 * 获取顶部通知的高度并返回一个css的高度
 * @returns
 */
function useGetAnnouncementHeight(): NonNullable<React.CSSProperties['height']> {
  const existAnnouncement = HeaderStore.existAnnouncement();
  return existAnnouncement ? 'var(--banner-height)' : '0px';
}

export default useGetAnnouncementHeight;
