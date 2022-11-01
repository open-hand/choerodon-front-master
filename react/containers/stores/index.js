/* eslint-disable */
import AppState from './c7n/AppState';
import HeaderStore from './c7n/HeaderStore';
import MenuStore from './c7n/MenuStore';
/**@type any */
let stores = {};

if (!window.__choeordonStores__) {
  window.__choeordonStores__ = {
    AppState,
    MenuStore,
    HeaderStore,
  };
  stores = window.__choeordonStores__;
} else {
  stores = window.__choeordonStores__;
}

export default stores;
