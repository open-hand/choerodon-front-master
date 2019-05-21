"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = findFirstLeafMenu;
function findFirstLeafMenu(menu) {
  var subMenus = menu.subMenus;

  if (subMenus && subMenus.length) {
    return findFirstLeafMenu(subMenus[0]);
  } else {
    return menu;
  }
}