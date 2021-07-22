/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Modal } from 'choerodon-ui/pro';
import { ModalProps } from 'choerodon-ui/pro/lib/modal/Modal';

import { NoticeVO } from './model';
import Layout from '../Layout';
import DetailModal from './DetailModal';
import styles from './index.less';
import useStore from './store';

const classNamePrefix = 'c7n-card-notice';

export default function Notice() {
  const { data } = useStore();

  const openDetailModal = (item: NoticeVO) => {
    Modal.open({
      title: '公告详情',
      drawer: true,
      children: <DetailModal item={item} />,
      closable: true,
      footer: false,
    } as ModalProps);
  };

  const NoticeRender = (notice: NoticeVO) => (
    <li className={styles[`${classNamePrefix}-li`]} key={notice.id}>
      <span className={styles[`${classNamePrefix}-header`]}>
        <span className={styles[`${classNamePrefix}-icon`]} />
        <span className={styles[`${classNamePrefix}-title`]} onClick={() => openDetailModal(notice)}>{notice.title}</span>
        <span className={styles[`${classNamePrefix}-date`]}>
          (
          {notice.sendDate}
          )
        </span>
      </span>
      <span
        className={styles[`${classNamePrefix}-content`]}
      >
        {notice.contentOverview}
      </span>
    </li>
  );

  return (
    <Layout title="公告" className={styles[classNamePrefix]}>
      <ul className={styles[`${classNamePrefix}-ul`]}>
        {data.map(NoticeRender)}
      </ul>
    </Layout>
  );
}
