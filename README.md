# 说明

动态引入地图脚本并添加地图工具 的`工具类`，不依赖其他js






# 方法以及参数配置


### loader 
> 初始化地图 
1. callback 地图js执行完毕的回调方法 此时地图还未创建

2. plugin
- key  地图key
- plugin 地图插件数组  ['AMap.ToolBar','AMap.Scale']
都已有默认值

callback尽量不要省略
其中plugin参数可省略

### addBasic
> 同步加载地图工具
1. map  地图对象



# 注意事项
1. 该方法可以再onload事件之前调用

2. 由于脚本加载是异步，所以地图的使用要在回调中使用


# 已解决问题


