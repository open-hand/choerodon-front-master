import React from 'react';
import { Row, Col, Tooltip } from 'choerodon-ui';
import classNames from 'classnames';
import { flatten } from 'lodash';

import { Card, Tip } from './model';
import useStore from './stores';
import Layout from '../Layout';
import styles from './index.less';

const classNamePrefix = 'c7n-card-overview';

export default function ResourceOverview() {
  const { cards } = useStore();

  // 分组
  const cardGroup: Array<Card[]> = cards.reduce((arr: Array<Card[]>, card: Card) => {
    if (arr[arr.length - 1].length < 3) arr[arr.length - 1].push(card);
    else arr.push([card]);

    return arr;
  }, [[]]);

  // 渲染计数（tooltip）
  const renderCount = (card: Card) => {
    if (!card.tips) return card.data;

    const getTip = (tips: Tip[]) => flatten(tips.map((tip) => {
      const titles: string[] = [];

      if (tip.children) {
        titles.push(tip.title);
        if (tip.blankLine) titles.push('');
        titles.push(...getTip(tip.children), '');
      } else {
        titles.push(`${tip.title}:  ${tip.count}`);
        if (tip.blankLine) titles.push('');
      }

      return titles;
    }));

    const tips = getTip(card.tips);
    if (!tips[tips.length - 1]) tips.pop(); // 移除最后的空格

    return (
      <Tooltip
        title={(
          <div style={{ whiteSpace: 'pre', maxHeight: '300px', overflow: 'auto' }}>
            {tips.join('\n')}
          </div>
        )}
      >
        {card.data}
      </Tooltip>
    );
  };

  // 根据分组渲染卡片
  const renderCards = (groups: Array<Card[]>) => groups.map((group) => (
    <Row className={styles[`${classNamePrefix}-row`]}>
      {
        group.map((card) => (
          <Col span={8} className={styles[`${classNamePrefix}-col`]} key={card.name}>
            <div className={classNames({
              [styles[`${classNamePrefix}-card`]]: true,
              [styles[`${classNamePrefix}-${card.name}`]]: true,
            })}
            >
              <span className={styles[`${classNamePrefix}-card-title`]}>{card.title}</span>
              <span className={styles[`${classNamePrefix}-card-count`]}>{renderCount(card)}</span>
            </div>
          </Col>
        ))
      }
    </Row>
  ));

  return (
    <Layout title="资源概览">
      <div className={styles[classNamePrefix]}>
        {renderCards(cardGroup)}
      </div>
    </Layout>
  );
}
