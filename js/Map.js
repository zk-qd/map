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
                    && !(key === 'name' && typeof source === 'function')
                    && !(key === 'length' && typeof source === 'function')
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
            } else if (!onfig.Object.create.toString() === ['Object object']) MapError.config3callbackExeception();
            return {
                callback,
                config,
            }
        }
    }
    const geocoder = Symbol('geocoder');
    // 无地图也能使用
    class Static {
        constructor() {
            if (new.target === Map) throw TypeError('本类不能实例化');
        }
        // 地理编码
        static [geocoder] = null;
        static createGeocoder(config) {
            this[geocoder] = new KMap.AMap.Geocoder({
                city: "长沙", //城市设为北京，默认：“全国”
                radius: 1000, //范围，默认：500
                lnag: 'zh-CN',
                batch: true,
                extensions: 'all',
                ...config,
            });
        }
        // 地理编码
        static getLocation(address, config, callback) {
            const result = MapScheme.config3callback(config, callback);
            config = result.config;
            callback = result.callback
            if (!this[geocoder])
                this.createGeocoder(config);
            // 传入数组批量查询 传入字符串查单个
            this[geocoder].getLocation(address, function (status, result) {
                if (status === 'complete' && result.geocodes.length)
                    callback && callback(result.geocodes[0].location)
                else {
                    console.error('根据地址查询经纬度失败');
                    callback && callback(null)
                }
            });
        }
        // 逆向地理编码
        static getAddress(lnglat, config, callback) {
            const result = MapScheme.config3callback(config, callback);
            config = result.config;
            callback = result.callback
            if (!this[geocoder])
                this.createGeocoder(config);
            // 传入[[],[]]批量查或者 传入[]查询单个
            this[geocoder].getAddress(lnglat, function (status, result) {
                if (status === 'complete' && result.regeocode)
                    callback && callback(result.regeocode.formattedAddress);
                else {
                    console.error('根据经纬度查询地址失败');
                    callback && callback('')
                }

            });
        }
    }
    // 地图调用的方法
    class Instance {
        constructor() {
            if (new.target === Map) throw TypeError('本类不能实例化');
        }
        // 添加基础工具
        addBasicTools() {
            // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
            this.$map.addControl(new KMap.AMap.ToolBar());

            // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
            this.$map.addControl(new KMap.AMap.Scale());

            // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
            this.$map.addControl(new KMap.AMap.OverView({ isOpen: true }));

            // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
            this.$map.addControl(new KMap.AMap.MapType());
            // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
            this.$map.addControl(new KMap.AMap.Geolocation());
        }

    }

    // 错误
    class MapError extends Error {
        constructor(message, location = '') {
            super();
            this.name = 'MapError';
            this.message = message;
            // Map.js:104 Uncaught MapError:selector[object HTMLDivElement]element is not undefiend
            this.stack = this.name + ': \n' + this.message + location;
        }
        // plugin
        static pluginExeception() {
            throw new MapError('Please pass in the correct one "plugin"', '\nloader');
        }
        // container
        static containerExeception(container) {
            throw new MapError('selector "#' + container +
                '" element is not undefiend', '\nbuild map fail')
        }
        // config and callback
        static config3callbackExeception() {
            throw new MapError('Wrong second parameter', 'geocoder or ...')
        }

    }
    class KMap extends Mixin(Instance, Static) {
        constructor() {
            super();
            // 地图
            this.$map = null;
        }
        // 地图类
        static AMap
        // 回调
        static loader({
            key = 'a1aba2049ce8ef3ed0dd419dd839b4bb',
            plugin = [],
            // map
            container = null,
            center = null,
        } = {}) {
            return new Promise((resolve, reject) => {
                // basic plugin
                var basicPlugins = ['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView', 'AMap.MapType', 'AMap.Geolocation'];
                // extensions plugin
                var extensionPlugins = function () {
                    // all plugin
                    if (plugin === 'all') plugin = ['AMap.Geocoder']
                    // not array
                    else if (!plugin instanceof Array)
                        MapError.pluginExeception();
                    return basicPlugins.concat(plugin).join(',').trim();
                }
                // dynamic build
                var script = document.createElement('script'),
                    src = 'http://webapi.amap.com/maps?v=1.4.14&key=' + key +
                        '&plugin=' + extensionPlugins() + '&callback=mapLoadingComplete';
                script.type = 'text/javascript';
                script.src = src;
                script.async = true;
                document.body.appendChild(script);
                // success callback
                window.mapLoadingComplete = function () {
                    // static
                    let kmap = null;
                    // save AMap class
                    KMap.AMap = window.AMap;
                    // static to singleton
                    function Static2Singleton() {
                        // build instance 
                        kmap = new KMap();
                        // build map, save inner
                        kmap.$map = new AMap.Map(container, {
                            center,
                        })
                    }
                    if (container) {
                        document.getElementById(container) || MapError.containerExeception(container);
                        // start singleton
                        Static2Singleton();
                    }
                    resolve(kmap);
                }
                // error callback
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
