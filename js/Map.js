var mapKit = {
    /**
     * builder map url
     *
     * initMap([,callback[,options]])
     * @param {Function} callback 
     * @param {Object} options Configuration 
     * @returns {undefined} 
     */
    loader: function (callback,options) {
        options = options || {};
        // 扩展配置
        var key = options.key || 'a1aba2049ce8ef3ed0dd419dd839b4bb',
            // 数组
            plugin = options.plugin,
            // 回调函数
            callback = callback || function () { };
        window.onLoadMap = callback;

        // 基础插件配置
        var basePlugin = 'AMap.ToolBar,AMap.Scale,AMap.OverView,AMap.MapType,AMap.Geolocation';

        var script = document.createElement('script'),
            src = 'http://webapi.amap.com/maps?v=1.4.14&key=' + key +
                '&plugin=' + basePlugin + (plugin ? ',' + plugin.join(',').trim() : '') + '&callback=onLoadMap';
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;
        document.body.appendChild(script);

    },
    // 添加基础工具
    addBasic: function (map) {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        map.addControl(new AMap.ToolBar());

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        map.addControl(new AMap.Scale());

        // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
        map.addControl(new AMap.OverView({ isOpen: true }));

        // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
        map.addControl(new AMap.MapType());

        // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
        // map.addControl(new AMap.Geolocation());
    },
}