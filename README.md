# choerodon-front-master

猪齿鱼前端框架，从原来的choerodon-front-boot中完全抽离出了页面显示的逻辑。

需要配合 [choerodon-front-boot](https://github.com/choerodon/choerodon-front-boot) 使用。

## 启动

```bash
npm install
npm start
```

访问 http://localhost:9090/ 查看效果

## 打包发布

```bash
npm install
npm run compile
npm publish
```

## 功能

- 菜单处理
- Header处理
- 右上角通知处理
- 项目列表
- 无授权页面的实现
- 授权失效页面的实现
- 通用Stores （AppState、MenuStore、HeaderStore）
- axios对象的封装
- 404页、403页的处理

## 在项目中使用

查看demo项目创建说明[CREATE_PROJECT.md](CREATE_PROJECT.md)

## 组件

- MasterHeader

- CommonMenu

- Page

- Content

- Header

- Loading

- Action

- Permission

- Remove

- axios

- store

- stores

- nomatch

- noaccess

- asyncLocaleProvider

- asyncRouter

- WSHandler

- PageTab

- PageWrap

- TabPage

- StatusTag

- Breadcrumb

- Choerodon
