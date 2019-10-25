# 创建Demo项目

此Demo项目基于`Choerodon`开发，使用`React`作为开发语言。

本文包括如下几个步骤：

1. 新建Demo项目
2. 新建Demo模块
3. 编写config.js
4. 编写.env
5. 编写package.json
6. 编写demo入口文件
7. 页面访问

## 新建Demo项目

本地新建一个空的项目`choerodon-todo-service`。

``` bash
mkdir -p choerodon-todo-service
cd choerodon-todo-service
```

## 新建Demo模块

创建新模块的文件夹

``` bash
mkdir -p react
```

## 编写config.js

在react文件夹下创建`config.js`

``` bash
cd react
touch config.js
```

```js
// config.js
const config = {
  master: './node_modules/@choerodon/master/lib/master.js',
  modules: ['.'],
};

module.exports = config;
```

## 编写.env

在react文件夹下创建`.env`

``` bash
cd react
touch .env
```

```env
// .env
API_HOST=http://api.staging.saas.hand-china.com
CLIENT_ID=localhost
```

## 编写package.json

在项目根目录下创建package.json

``` bash
cd ..
npm init
```

``` json
// package.json
{
  "name": "@choerodon/demo",  // name为模块名（可以增加@choerodon scope）
  "routeName": "demo",  // routeName为路由前缀（如空，取name为路由前缀）
  "version": "1.0.0",
  "description": "",
  "main": "./lib/index.js",
  "scripts": {
    "start": "choerodon-front-boot start --config ./react/config.js",
    "dist": "choerodon-front-boot dist --config ./react/config.js",
    "lint-staged": "lint-staged",
    "lint-staged:es": "eslint",
    "compile": "choerodon-front-boot compile"
  },
  "contributors": [
    "choerodon"
  ],
  "license": "ISC",
  "dependencies": {
    "@choerodon/boot": "0.19.x",
    "@choerodon/master": "0.19.x"  // 表示进入页面后的部分，菜单、header和AutoRouter等，可自己配置
  },
  "files": [
    "lib"
  ],
  "lint-staged": {
    "react/**/*.{js,jsx}": [
      "npm run lint-staged:es"
    ],
    "react/**/*.scss": "stylelint --syntax scss"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "devDependencies": {
    "babel-preset-env": "^1.7.0",
    "gulp": "^3.9.1",
    "gulp-babel": "^7.0.1",
    "through2": "^2.0.3"
  }
}
```

## 编写demo入口文件

在`react`文件夹下创建`index`文件。

`routes`文件夹用于存放前端的页面。

``` bash
touch react/index.js
```

``` js
// index.js
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { nomatch } from '@choerodon/boot';

function Index({ match }) {
  return (
    <Switch>
      <Route path="*" component={nomatch} />
    </Switch>
  );
}

export default inject('AppState')(Index);
```

## 启动及页面访问

在`package.json` 同级目录下，安装并启动。

``` bash
npm install
npm run start
```

当开始编译后会自动打开浏览器，通过 `localhost:9090`，查看页面效果。
