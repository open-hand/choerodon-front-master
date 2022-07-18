## [2.1.3](https://github.com/choerodon/choerodon-front-master/compare/2.1.2...2.1.3) (2022-07-18)


### Bug Fixes

* **workbenchdoc:** 修复工作台知识卡片链接跳转生成的链接与敏捷内部跳转知识库不一致 ([fad3b42](https://github.com/choerodon/choerodon-front-master/commit/fad3b4207dfb6aeb3d11e70180619ebef6eb2e7e))
* **全局:** 修改message传入Error对象的问题 ([0867ad8](https://github.com/choerodon/choerodon-front-master/commit/0867ad8acb6fefc86fbd6e14949bdab7ec35b426))
* **全局:** 增加error拦截器 ([0b44dd4](https://github.com/choerodon/choerodon-front-master/commit/0b44dd492c15b152e628eb9856b5fb180cbc36cd))
* **项目搜索:** 后端改了接口 ([06ad2a9](https://github.com/choerodon/choerodon-front-master/commit/06ad2a973f57ffae2a92920efcc51f00381bfdc8))


### Features

* **提单:** 将提单移动到base-pro ([acc2abf](https://github.com/choerodon/choerodon-front-master/commit/acc2abf7a8890fbef9ae2f64155e81b9070820dd))



## [2.1.2](https://github.com/choerodon/choerodon-front-master/compare/2.1.1...2.1.2) (2022-07-13)


### Bug Fixes

* **userlabels:** agile userlabels 样式 ([494c45b](https://github.com/choerodon/choerodon-front-master/commit/494c45b2ab090e150328eabfc435708bffb6ebab))


### Features

* **全局:** 增加select下拉框加载更多全局配置 ([14bf1c3](https://github.com/choerodon/choerodon-front-master/commit/14bf1c3ffdf702fd56fa98e646ec3fbd22d42202)), closes [#2954](https://github.com/choerodon/choerodon-front-master/issues/2954)



## [2.1.1](https://github.com/choerodon/choerodon-front-master/compare/2.1.0...2.1.1) (2022-07-12)


### Bug Fixes

* **创建项目:** 修改创建项目编码不能出现emoji的问题 ([ea29e57](https://github.com/choerodon/choerodon-front-master/commit/ea29e57966c154fff0a9830d2b493887b9b7495d)), closes [#3045](https://github.com/choerodon/choerodon-front-master/issues/3045)
* **提单:** 修改提单fieldData ([3bd6a3c](https://github.com/choerodon/choerodon-front-master/commit/3bd6a3c8c6579146eaebe95bdff5bec2c2476b20))
* **项目列表:** 样式修改 ([dc0caef](https://github.com/choerodon/choerodon-front-master/commit/dc0caef65e3db3e16837b9fb275d691dcb9815eb))


### Features

* **帮助文档链接:** 修改帮助文档链接 ([7810a1f](https://github.com/choerodon/choerodon-front-master/commit/7810a1f75151983df6a42e6cde988883313d73bf))



# [2.1.0](https://github.com/choerodon/choerodon-front-master/compare/2.0.8...2.1.0) (2022-07-09)


### Bug Fixes

* **钉钉跳转:** 修复钉钉跳转bug ([8626781](https://github.com/choerodon/choerodon-front-master/commit/86267810d8be47f2cb9115fb0c9d39dac53662c5))
* **钉钉跳转:** 修复accesstoken存在时候钉钉跳转逻辑 ([0b0f6e8](https://github.com/choerodon/choerodon-front-master/commit/0b0f6e8821f13a5e537a7b238840a1fe495ebfd5))
* **钉钉跳转:** 修改钉钉跳转外部逻辑 ([1b377fd](https://github.com/choerodon/choerodon-front-master/commit/1b377fd73707a8bf574536931e115638c5ec6624))
* **人员标签:** 修改人员标签样式 ([5e171c4](https://github.com/choerodon/choerodon-front-master/commit/5e171c4a75ac73733fc1668308e9719963acaa46))
* **提单:** 修改提单在非项目层没有获取到默认值的问题 ([c00375e](https://github.com/choerodon/choerodon-front-master/commit/c00375ea21980ad8c141222aeaa6a7e5a6846917))
* **项目管理:** 修改文字错误 ([031f8b1](https://github.com/choerodon/choerodon-front-master/commit/031f8b1a0d528bed3061528f14eb4b5ab2347104))
* **项目列表:** 调整项目列表项目名称max宽度 ([6754994](https://github.com/choerodon/choerodon-front-master/commit/6754994d90f5183ec63590367726a7f8924198ea))
* **项目列表:** 项目状态颜色 ([d3f6dbf](https://github.com/choerodon/choerodon-front-master/commit/d3f6dbfac777821413b6746ef7a2877b3cda0045))
* **项目列表:** 修改项目列表样式 ([8b9caa3](https://github.com/choerodon/choerodon-front-master/commit/8b9caa35ba1848ab6c50e74b970cb1480ca12444))
* **项目列表:** 修改样式 ([a6af0d8](https://github.com/choerodon/choerodon-front-master/commit/a6af0d8388048b2c3005603b4f8475f1e184d6ea))
* **项目列表:** 修改select disable的文字颜色 ([b1c96e6](https://github.com/choerodon/choerodon-front-master/commit/b1c96e69876d3c97ff9c178d493c2566f46efb64))
* **api:** 修改api ([e52e5f8](https://github.com/choerodon/choerodon-front-master/commit/e52e5f89e5b3bfddfe00e68bcffa1975b0ea9f9e))
* **apis:** 修复快速链接无法选择项目的问题 ([2e28262](https://github.com/choerodon/choerodon-front-master/commit/2e28262cf95a7929ff9c4083fdf7984b213d6001))
* **pagewrapper:** 修复通知种切换tab,需要点击两次才成功的问题 ([68bd8c8](https://github.com/choerodon/choerodon-front-master/commit/68bd8c82be903b75e70687d8c389e17ba941a178))
* **question-node:** 工作台代办事项和我的关注，类型没有对齐 ([3281514](https://github.com/choerodon/choerodon-front-master/commit/328151458bae67620835eb1595fa89d4391ff46b))
* **question-node:** 修复待办事项卡片样式问题 ([5ad8bb9](https://github.com/choerodon/choerodon-front-master/commit/5ad8bb9878c75b414b7bc9ca8dbabe94f47383fd))
* **question-node:** 修复工作台-我的关注，点击需求不能查看详情的问题 ([d1a637d](https://github.com/choerodon/choerodon-front-master/commit/d1a637d1c607b6ba4974d9a88cad2cd04c30c26d))
* **question-node:** 修复工作台-我的关注，点击需求不能查看详情的问题 ([cc9da02](https://github.com/choerodon/choerodon-front-master/commit/cc9da02c54601b080959210a23410485b1a04c7b))
* **question-node:** 修复工作台我的关注卡片需求弹框没有打开的问题 ([469b2ea](https://github.com/choerodon/choerodon-front-master/commit/469b2ea47e5cdb8506adf3b08ed3dc6492e783bb))
* **question-node:** 修复工作台我执行的用例打不开详情的问题 ([a198af4](https://github.com/choerodon/choerodon-front-master/commit/a198af4823264198200520e14bd2823fb80464fd))
* **question-node:** 修复工作台我执行的用例打不开详情的问题 ([539c3a3](https://github.com/choerodon/choerodon-front-master/commit/539c3a376622c4128681a66a3bbed53d36fdfbcb))
* **question-search:** 修复工作台卡片筛选没有瀑布类型的问题 ([67d3b7b](https://github.com/choerodon/choerodon-front-master/commit/67d3b7bedcae455351d889e15fa8c7f367234e80))
* **todothings:** 修复工作台待审核卡片滚动条问题 ([b637a56](https://github.com/choerodon/choerodon-front-master/commit/b637a569088c60987aba78e1fd5f9b8698c32238))
* **todothings:** 修复工作台待审核卡片滚动条问题 ([5413635](https://github.com/choerodon/choerodon-front-master/commit/54136352b95623842134aa9c84cda1cfa770312f))
* **workbech:** 修复工作台我的关注点击需求详情报错的问题 ([d4e8d33](https://github.com/choerodon/choerodon-front-master/commit/d4e8d33247902a21a82251c2add3d2ff0917d2bf))


### Features

* **钉钉免登:** 钉钉免登外部浏览器跳转 ([7f0829b](https://github.com/choerodon/choerodon-front-master/commit/7f0829b3af3ea4a1a1b621ea757e94da49519f39))
* **提单:** 增加提单默认值 ([70047a5](https://github.com/choerodon/choerodon-front-master/commit/70047a55c35fc778b1f4365d986ecf523a5892d2))
* **提单sdk:** 修改提单sdk为动态token ([5fbf799](https://github.com/choerodon/choerodon-front-master/commit/5fbf79964703563dbc1c4c9cb1b676f3560ffe21))
* **用户管理:** 修改用户管理标签省略号号tooltip只显示省略部分 ([6672b75](https://github.com/choerodon/choerodon-front-master/commit/6672b75c1692c812f30b36d1f6cccbeadb0de490)), closes [#3012](https://github.com/choerodon/choerodon-front-master/issues/3012)
* **addcomponentsmodal:** 项目概览卡片配置去掉瀑布类型的菜单 ([5f01b8e](https://github.com/choerodon/choerodon-front-master/commit/5f01b8e63f0463acd8e77d8d111096d1f68bab2b))
* **addcomponentsmodal:** 项目概览卡片配置去掉瀑布类型的菜单 ([0706688](https://github.com/choerodon/choerodon-front-master/commit/0706688a4e85c5cf812b9853ea19f62df2f45809))
* **api:** 加项目协作api ([958960b](https://github.com/choerodon/choerodon-front-master/commit/958960b983c2ec4c665fd4b3875d939a3674175a))



## [2.0.8](https://github.com/choerodon/choerodon-front-master/compare/2.0.7...2.0.8) (2022-07-04)


### Features

* **user标签:** user标签加自适应 ([a48c5d2](https://github.com/choerodon/choerodon-front-master/commit/a48c5d2543d7990738de7e212de60de0eb058f25))



## [2.0.7](https://github.com/choerodon/choerodon-front-master/compare/2.0.6...2.0.7) (2022-06-24)



## [2.0.6](https://github.com/choerodon/choerodon-front-master/compare/2.0.5...2.0.6) (2022-06-17)



## [2.0.5](https://github.com/choerodon/choerodon-front-master/compare/2.0.4...2.0.5) (2022-06-06)



## [2.0.4](https://github.com/choerodon/choerodon-front-master/compare/2.0.3...2.0.4) (2022-06-02)



## [2.0.2](https://github.com/choerodon/choerodon-front-master/compare/2.0.1...2.0.2) (2022-05-24)



# [2.0.0](https://github.com/choerodon/choerodon-front-master/compare/1.3.3...2.0.0) (2022-05-21)



## [1.3.2](https://github.com/choerodon/choerodon-front-master/compare/1.3.1...1.3.2) (2022-04-27)



# [1.3.0-alpha.5](https://github.com/choerodon/choerodon-front-master/compare/1.3.0-alpha.4...1.3.0-alpha.5) (2022-04-22)



# [1.3.0-alpha.4](https://github.com/choerodon/choerodon-front-master/compare/1.3.0-alpha.3...1.3.0-alpha.4) (2022-04-02)



# [1.3.0-alpha.3](https://github.com/choerodon/choerodon-front-master/compare/1.3.0-alpha.2...1.3.0-alpha.3) (2022-03-28)



# [1.3.0-alpha.2](https://github.com/choerodon/choerodon-front-master/compare/1.3.0-alpha.1...1.3.0-alpha.2) (2022-03-22)



# [1.3.0-alpha.1](https://github.com/choerodon/choerodon-front-master/compare/1.2.4...1.3.0-alpha.1) (2022-03-18)



## [1.2.4](https://github.com/choerodon/choerodon-front-master/compare/1.2.3...1.2.4) (2022-03-08)



## [1.2.3](https://github.com/choerodon/choerodon-front-master/compare/1.2.2...1.2.3) (2022-02-25)



## [1.2.2](https://github.com/choerodon/choerodon-front-master/compare/1.2.1...1.2.2) (2022-02-18)



## [1.2.1](https://github.com/choerodon/choerodon-front-master/compare/1.2.0...1.2.1) (2022-02-15)



# [1.2.0](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.14...1.2.0) (2022-02-11)



# [1.2.0-alpha.14](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.13...1.2.0-alpha.14) (2022-01-26)



# [1.2.0-alpha.13](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.12...1.2.0-alpha.13) (2022-01-17)



# [1.2.0-alpha.11](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.10...1.2.0-alpha.11) (2022-01-12)



# [1.2.0-alpha.10](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.9...1.2.0-alpha.10) (2022-01-11)



# [1.2.0-alpha.9](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.8...1.2.0-alpha.9) (2022-01-08)



# [1.2.0-alpha.3](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.2...1.2.0-alpha.3) (2021-12-23)



# [1.2.0-alpha.8](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.7...1.2.0-alpha.8) (2021-12-31)



# [1.2.0-alpha.7](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.6...1.2.0-alpha.7) (2021-12-31)



# [1.2.0-alpha.6](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.5...1.2.0-alpha.6) (2021-12-30)



# [1.2.0-alpha.5](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.4...1.2.0-alpha.5) (2021-12-29)



# [1.2.0-alpha.4](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.3...1.2.0-alpha.4) (2021-12-23)



# [1.2.0-alpha.3](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.2...1.2.0-alpha.3) (2021-12-23)



# [1.2.0-alpha.2](https://github.com/choerodon/choerodon-front-master/compare/1.2.0-alpha.1...1.2.0-alpha.2) (2021-12-20)



## [1.1.3](https://github.com/choerodon/choerodon-front-master/compare/1.1.2...1.1.3) (2021-12-03)



## [1.1.2](https://github.com/choerodon/choerodon-front-master/compare/1.1.1...1.1.2) (2021-11-11)



## [1.1.1](https://github.com/choerodon/choerodon-front-master/compare/1.1.0...1.1.1) (2021-11-10)



# [1.1.0](https://github.com/choerodon/choerodon-front-master/compare/1.1.0-alpha.7...1.1.0) (2021-11-05)



# [1.1.0-alpha.7](https://github.com/choerodon/choerodon-front-master/compare/1.1.0-alpha.6...1.1.0-alpha.7) (2021-10-29)



# [1.1.0-alpha.5](https://github.com/choerodon/choerodon-front-master/compare/1.1.0-alpha.4...1.1.0-alpha.5) (2021-10-13)



# [1.1.0-alpha.4](https://github.com/choerodon/choerodon-front-master/compare/1.1.0-alpha.3...1.1.0-alpha.4) (2021-10-11)



# [1.1.0-alpha.3](https://github.com/choerodon/choerodon-front-master/compare/1.1.0-alpha.2...1.1.0-alpha.3) (2021-09-27)



# [1.1.0-alpha.2](https://github.com/choerodon/choerodon-front-master/compare/1.1.0-alpha.1...1.1.0-alpha.2) (2021-09-23)



# [1.1.0-alpha.1](https://github.com/choerodon/choerodon-front-master/compare/1.0.9...1.1.0-alpha.1) (2021-09-18)



## [1.0.6](https://github.com/choerodon/choerodon-front-master/compare/1.0.5...1.0.6) (2021-07-07)



## [0.25.9](https://github.com/choerodon/choerodon-front-master/compare/1.0.3...0.25.9) (2021-06-30)



## [1.0.9](https://github.com/choerodon/choerodon-front-master/compare/1.0.8...1.0.9) (2021-07-22)



## [1.0.8](https://github.com/choerodon/choerodon-front-master/compare/1.0.7...1.0.8) (2021-07-20)



## [1.0.7](https://github.com/choerodon/choerodon-front-master/compare/1.0.6...1.0.7) (2021-07-13)



## [1.0.6](https://github.com/choerodon/choerodon-front-master/compare/1.0.5...1.0.6) (2021-07-07)



## [0.25.9](https://github.com/choerodon/choerodon-front-master/compare/1.0.3...0.25.9) (2021-06-30)



## [1.0.5](https://github.com/choerodon/choerodon-front-master/compare/1.0.4...1.0.5) (2021-07-02)



## [1.0.3](https://github.com/choerodon/choerodon-front-master/compare/1.0.2...1.0.3) (2021-06-25)



## [1.0.2](https://github.com/choerodon/choerodon-front-master/compare/1.0.1...1.0.2) (2021-06-21)



## [1.0.1](https://github.com/choerodon/choerodon-front-master/compare/1.0.0...1.0.1) (2021-06-21)



# [1.0.0](https://github.com/choerodon/choerodon-front-master/compare/0.25.8...1.0.0) (2021-06-18)



## [0.25.9](https://github.com/choerodon/choerodon-front-master/compare/1.0.3...0.25.9) (2021-06-30)



## [1.0.3](https://github.com/choerodon/choerodon-front-master/compare/1.0.2...1.0.3) (2021-06-25)



## [1.0.2](https://github.com/choerodon/choerodon-front-master/compare/1.0.1...1.0.2) (2021-06-21)



## [1.0.1](https://github.com/choerodon/choerodon-front-master/compare/1.0.0...1.0.1) (2021-06-21)



# [1.0.0](https://github.com/choerodon/choerodon-front-master/compare/0.25.8...1.0.0) (2021-06-18)



## [0.25.8](https://github.com/choerodon/choerodon-front-master/compare/0.25.7...0.25.8) (2021-05-27)



## [0.25.7](https://github.com/choerodon/choerodon-front-master/compare/0.25.6...0.25.7) (2021-05-19)



## [0.25.6](https://github.com/choerodon/choerodon-front-master/compare/0.25.5...0.25.6) (2021-05-08)



## [0.25.5](https://github.com/choerodon/choerodon-front-master/compare/0.25.4...0.25.5) (2021-05-06)



## [0.25.4](https://github.com/choerodon/choerodon-front-master/compare/0.25.3...0.25.4) (2021-04-22)



## [0.25.3](https://github.com/choerodon/choerodon-front-master/compare/0.25.2...0.25.3) (2021-04-20)



## [0.25.2](https://github.com/choerodon/choerodon-front-master/compare/0.25.1...0.25.2) (2021-04-16)



## [0.25.1](https://github.com/choerodon/choerodon-front-master/compare/0.25.0...0.25.1) (2021-04-13)



# [0.25.0](https://github.com/choerodon/choerodon-front-master/compare/0.25.0-alpha.4...0.25.0) (2021-04-09)



# [0.25.0-alpha.4](https://github.com/choerodon/choerodon-front-master/compare/0.25.0-alpha.3...0.25.0-alpha.4) (2021-03-09)



# [0.25.0-alpha.3](https://github.com/choerodon/choerodon-front-master/compare/0.25.0-alpha.2...0.25.0-alpha.3) (2021-03-09)



# [0.25.0-alpha.2](https://github.com/choerodon/choerodon-front-master/compare/0.25.0-alpha.1...0.25.0-alpha.2) (2021-03-02)



## [0.24.4](https://github.com/choerodon/choerodon-front-master/compare/0.24.3...0.24.4) (2021-02-03)



## [0.24.3](https://github.com/choerodon/choerodon-front-master/compare/0.24.2...0.24.3) (2021-01-14)



## [0.24.2](https://github.com/choerodon/choerodon-front-master/compare/0.24.1...0.24.2) (2020-12-31)



## [0.24.1](https://github.com/choerodon/choerodon-front-master/compare/0.24.0...0.24.1) (2020-12-29)



# [0.24.0](https://github.com/choerodon/choerodon-front-master/compare/0.24.0-alpha.7...0.24.0) (2020-12-24)



# [0.24.0-alpha.7](https://github.com/choerodon/choerodon-front-master/compare/0.24.0-alpha.6...0.24.0-alpha.7) (2020-11-12)



# [0.24.0-alpha.6](https://github.com/choerodon/choerodon-front-master/compare/0.24.0-alpha.5...0.24.0-alpha.6) (2020-11-10)



# [0.24.0-alpha.5](https://github.com/choerodon/choerodon-front-master/compare/0.24.0-alpha.4...0.24.0-alpha.5) (2020-11-06)



## [0.23.6](https://github.com/choerodon/choerodon-front-master/compare/0.23.5...0.23.6) (2020-10-16)



## [0.23.5](https://github.com/choerodon/choerodon-front-master/compare/0.24.0-alpha.3...0.23.5) (2020-10-09)



# [0.24.0-alpha.4](https://github.com/choerodon/choerodon-front-master/compare/0.23.6...0.24.0-alpha.4) (2020-10-19)



# [0.24.0-alpha.3](https://github.com/choerodon/choerodon-front-master/compare/0.24.0-alpha.2...0.24.0-alpha.3) (2020-09-24)



# [0.24.0-alpha.2](https://github.com/choerodon/choerodon-front-master/compare/0.24.0-alpha.1...0.24.0-alpha.2) (2020-09-15)



# [0.24.0-alpha.1](https://github.com/choerodon/choerodon-front-master/compare/0.23.4...0.24.0-alpha.1) (2020-09-11)



## [0.23.6](https://github.com/choerodon/choerodon-front-master/compare/0.23.5...0.23.6) (2020-10-16)



## [0.23.5](https://github.com/choerodon/choerodon-front-master/compare/0.24.0-alpha.3...0.23.5) (2020-10-09)



# [0.24.0-alpha.3](https://github.com/choerodon/choerodon-front-master/compare/0.24.0-alpha.2...0.24.0-alpha.3) (2020-09-24)



# [0.24.0-alpha.2](https://github.com/choerodon/choerodon-front-master/compare/0.24.0-alpha.1...0.24.0-alpha.2) (2020-09-15)



# [0.24.0-alpha.1](https://github.com/choerodon/choerodon-front-master/compare/0.23.4...0.24.0-alpha.1) (2020-09-11)



## [0.23.4](https://github.com/choerodon/choerodon-front-master/compare/0.23.3...0.23.4) (2020-09-02)



## [0.23.3](https://github.com/choerodon/choerodon-front-master/compare/0.23.2...0.23.3) (2020-08-21)



## [0.23.2](https://github.com/choerodon/choerodon-front-master/compare/0.23.1...0.23.2) (2020-08-14)



## [0.23.1](https://github.com/choerodon/choerodon-front-master/compare/0.23.0...0.23.1) (2020-08-05)



# [0.23.0-alpha.4](https://github.com/choerodon/choerodon-front-master/compare/0.23.0-alpha.3...0.23.0-alpha.4) (2020-07-06)



# [0.23.0-alpha.3](https://github.com/choerodon/choerodon-front-master/compare/0.23.0-alpha.2...0.23.0-alpha.3) (2020-06-29)



# [0.23.0-alpha.2](https://github.com/choerodon/choerodon-front-master/compare/0.23.0-alpha.1...0.23.0-alpha.2) (2020-06-24)



# [0.22.0](https://github.com/choerodon/choerodon-front-master/compare/0.21.0...0.22.0) (2020-06-05)



# [0.21.0](https://github.com/choerodon/choerodon-front-master/compare/0.20.1...0.21.0) (2020-02-24)



## [0.20.1](https://github.com/choerodon/choerodon-front-master/compare/0.20.0...0.20.1) (2020-01-06)



# [0.20.0](https://github.com/choerodon/choerodon-front-master/compare/0.19.2...0.20.0) (2019-12-25)



## [0.19.2](https://github.com/choerodon/choerodon-front-master/compare/0.19.1...0.19.2) (2019-11-12)



## [0.19.1](https://github.com/choerodon/choerodon-front-master/compare/0.19.0...0.19.1) (2019-10-29)



# [0.19.0](https://github.com/choerodon/choerodon-front-master/compare/0.18.1...0.19.0) (2019-10-25)



# [0.18.0](https://github.com/choerodon/choerodon-front-master/compare/0.17.3...0.18.0) (2019-06-21)



## [0.17.3](https://github.com/choerodon/choerodon-front-master/compare/0.17.2...0.17.3) (2019-06-14)



## [0.17.2](https://github.com/choerodon/choerodon-front-master/compare/0.17.1...0.17.2) (2019-06-06)



## [0.17.1](https://github.com/choerodon/choerodon-front-master/compare/0.17.0...0.17.1) (2019-05-28)



# 0.17.0 (2019-05-24)



