void function (window) {
    function Mixin(...mixins) {
        class Mix {
            constructor() {
                for (let mixin of mixins) {
                    copyProperties(this, new mixin());
                }
            }
        }
        for (let mixin of mixins) {
            copyProperties(Mix, mixin);
            copyProperties(Mix.prototype, mixin.prototype);
        }
        function copyProperties(target, source) {
            for (let key of Reflect.ownKeys(source)) {
                if (key !== 'constructor'
                    && key !== 'prototype'
                    && (key !== 'name'
                        || key === 'name' && source !== 'function')
                ) {
                    let desc = Object.getOwnPropertyDescriptor(source, key);
                    Object.defineProperty(target, key, desc);
                }
            }
        }
        return Mix;
    }
    const MapScheme = {
        config3callback/* verify config and callback */(config, callback) {
            if (config && typeof config === 'function') {
                callback = config;
                config = {};
            } else if (!onfig.Object.create.toString() === ['Object object']) throw new MapError('Wrong second parameter');
        }
    }
    // 无地图也能使用
    class Static {

    }
    // 地图调用的方法
    class Instance {
        constructor() {
            if (new.target === Map) throw TypeError('本类不能实例化');
            // 地理编码
            this.geocoder = null;
        }
        // 添加基础工具
        addBasicTools() {
            // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
            this.map.addControl(new this.$KMap.ToolBar());

            // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
            this.map.addControl(new this.$KMap.Scale());

            // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
            this.map.addControl(new this.$KMap.OverView({ isOpen: true }));

            // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
            this.map.addControl(new this.$KMap.MapType());
            // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
            // map.addControl(new $AMap.Geolocation());
        }
        createGeocoder(config) {
            this.geocoder = new this.$KMap.Geocoder({
                city: "长沙", //城市设为北京，默认：“全国”
                radius: 1000, //范围，默认：500
                lnag: 'zh-CN',
                batch: true,
                extensions: 'all',
                ...config,
            });
        }
        // 地理编码
        getLocation(address, config, callback) {
            MapScheme.config3callback(config, callback);
            if (!this.geocoder)
                this.createGeocoder(config);
            // 传入数组批量查询 传入字符串查单个
            this.geocoder.getLocation(address, function (status, result) {
                if (status === 'complete' && result.geocodes.length)
                    callback || callback(result.geocodes[0].location)
                else
                    console.error('根据地址查询经纬度失败');
            });
        }
        // 逆向地理编码
        getAddress(lnglat, config, callback) {
            MapScheme.config3callback(config, callback);
            if (!this.geocoder)
                this.createGeocoder(config);
            // 传入[[],[]]批量查或者 传入[]查询单个
            this.geocoder.getAddress(lnglat, function (status, result) {
                if (status === 'complete' && result.regeocode)
                    callback(result.regeocode.formattedAddress);
                else
                    console.error('根据经纬度查询地址失败');
            });
        }
    }

    // 错误
    class MapError extends Error {
        constructor(message, location) {
            super();
            this.name = 'MapError';
            this.message = message;
            this.stack = this.name + ':' + this.message + location;
        }
    }
    class KMap extends Mixin(Instance, Static) {
        constructor() {
            super();
            // 地图
            this.$map = null;
            this.$KMap = null;
        }
        // 回调
        static loader({
            key = 'a1aba2049ce8ef3ed0dd419dd839b4bb',
            plugin = [],
            // map
            container = null,
            center = null,
        } = {}) {
            new Promise((resolve, reject) => {
                // 基础插件配置
                var basePlugin = 'AMap.ToolBar,AMap.Scale,AMap.OverView,AMap.MapType,AMap.Geolocation,';
                // plugin = [AMap.Geocoder,]
                var script = document.createElement('script'),
                    src = 'http://webapi.amap.com/maps?v=1.4.14&key=' + key +
                        '&plugin=' + basePlugin + plugin.join(',').trim() + '&callback=mapLoadingComplete';
                script.type = 'text/javascript';
                script.src = src;
                script.async = true;
                document.body.appendChild(script);
                window.mapLoadingComplete = function () {
                    // static to singleton
                    function Static2Singleton() {
                        // build instance 
                        const kmap = new KMap();
                        // save inner  
                        kmap.$KMap = window.AMap;
                        // verify container
                        container || (new MapError('container is empty'));
                        // build map, save inner
                        kmap.$map = new AMap(container, {
                            center: center,
                        })
                        return kmap;
                    }
                    resolve(kmap);
                }
                script.addEventListener('error', function (e) {
                    reject(e);
                }, {
                    capture: false,
                    once: true,
                    passive: false,
                });
            })
        }
    }
    window.KMap = KMap;
}(window)
