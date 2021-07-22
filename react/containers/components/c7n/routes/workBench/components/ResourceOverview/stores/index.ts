import { useState, useEffect } from 'react';

import { axios } from '@/index';
import AppState from '@/containers/stores/c7n/AppState';
import {
  RescoreDTO, RescoreTotalName, RescoreGroupName, RescoreName, Card,
} from '../model';

export default function useStore() {
  const [cards, setCards] = useState<Card[]>([]);

  const fetchData = async () => {
    let resourceData: RescoreDTO | undefined;
    try {
      resourceData = (await axios.get(`devops/v1/organizations/${AppState.currentMenuType?.organizationId}/resource/general`)) as unknown as RescoreDTO;
    } catch (err) {
      window.console.log('request failed:', err);
    }

    if (!resourceData) return;

    const cardsList:Array<{
      name:RescoreName,
      title: string,
    }> = [
      {
        name: 'host',
        title: '主机',
      },
      {
        name: 'cluster',
        title: '集群',
      },
      {
        name: 'env',
        title: '环境',
      },
    ];

    const data: Card[] = cardsList.map(({ name, title }) => ({
      name,
      title,
      data: resourceData![`${name}Total` as RescoreTotalName],
      tips: resourceData![`${name}Groups` as RescoreGroupName]?.map((d) => ({
        title: d.groupName,
        count: d.count,
      })),
    }));

    setCards(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    cards,
  };
}
