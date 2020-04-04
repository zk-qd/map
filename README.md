# Explanation

# Configuration

### Parameter

#### Init Build (static mode)

| Name   |  type  | descriptor | default | required |
| ------ | :----: | :--------: | ------: | :------: |
| key    | string |  地图 key  |     ... |    no    |
| plugin | array  |  插件数组  |      [] |    no    |

#### Map (singleton mode)

| Name      |  type  | descriptor  | default | required |
| --------- | :----: | :---------: | ------: | :------: |
| container | string | 地图容器 id |    null |   yes    |
| center    | lnglat | 中心点数组  |    null |    no    |

# Class

### MapError

### Static

> 静态属性方法

### Instance

> 实例属性方法

# Scheme

### Mixin

> 混合类

### MapScheme

> 内部使用

#### API

| Name                              |     Parameter      |    Return     |                        Description |
| --------------------------------- | :----------------: | :-----------: | ---------------------------------: |
| config3callback(config, callback) | {object,function}  |               |         verify config and callback |
| pageData([,page])                 |   {index,count}    | {index,count} | 获取分页以及传入参数自定义获取分页 |
| renderPage(data)                  | {index,rows,pages} |               |                           渲染分页 |
| renderData(data)                  |      {datas}       |               |                           渲染表格 |
| pHide()                           |                    |               |                           隐藏分页 |
| tHide()                           |                    |               |                           隐藏表格 |
| dead()                            |                    |               |                           销毁表格 |
