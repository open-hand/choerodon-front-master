import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Store from '../../stores';
import findFirstLeafMenu from '../../../../../util/findFirstLeafMenu';
import { historyPushMenu } from '../../../../../../common';
import Card from './Card';

const ListView = observer(() => {
  const {
    dataSet, AppState,
    HeaderStore, MenuStore, history,
  } = useContext(Store);

  function handleClickProject() {
    const record = dataSet.current;
    const { id, name, type, organizationId, category } = record.toData();
    MenuStore.loadMenuData({ type, id }, false).then((menus) => {
      let route;
      let path;
      let domain;
      if (menus.length) {
        const { route: menuRoute, domain: menuDomain } = findFirstLeafMenu(menus[0]);
        route = menuRoute;
        domain = menuDomain;
      }
      if (route) {
        path = `/?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;
        if (organizationId) {
          path += `&organizationId=${organizationId}&orgId=${organizationId}`;
        }
      }
      if (path) {
        historyPushMenu(history, path, domain);
      }
    });
  }

  function renderCard(record) {
    const cardPlainObj = record.toData();
    return <Card {...cardPlainObj} />;
  }

  return (
    <React.Fragment>
      {dataSet.map(r => renderCard(r))}
    </React.Fragment>
  );
});

export default ListView;
