## OCTOPUS-MAP API (V0.1.0)



基于openlayer V6.6.1 为基础,进行二次开发的地图工具包,通过二次封装,简化 openlayer 的开发难度



#### 安装方法

```
npm install octopus-map -S
```



#### 引用

```javascript
import MapInit from 'octopus-map'
```



### MapInit 核心类



#### 创建实例

| 构造函数         | 返回    | 说明           |
| ---------------- | ------- | -------------- |
| MapInit(options) | MapInit | 初始化地图实例 |



| 属性名          | 类型                                                         | 必须  | 默认值 | 说明                                   |
| --------------- | ------------------------------------------------------------ | ----- | ------ | -------------------------------------- |
| target          | String \| Element                                            | true  | null   | 用于渲染地图的 dom ID 或者标签本身实例 |
| useControl      | Boolean \| {zoom:Boolean, rotate: Boolean, attribution: Boolean} | false | false  | 是否使用地图自带控制按钮               |
| doubleClickZoom | Boolean                                                      | false | false  | 是否允许双击放大地图                   |



```javascript
const Tmap = new MapInit({
    target: 'root',
    useControl: false,
    doubleClickZoom: false
})
```



#### 实例属性

| 属性名       | 描述                              |
| ------------ | --------------------------------- |
| map          | map 实例                          |
| layers       | 返回添加的 layer 的实例数组       |
| interactions | 返回添加的 interaction 的实例数组 |
| overlays     | 返回添加的 overlay 的实例数组     |

 

#### 实例方法

##### useTianDiTu

| 方法名               | 返回 | 说明                                             |
| -------------------- | ---- | ------------------------------------------------ |
| useTianDiTu(options) | null | 创建使用天地图数据的 Layer,并自动添加到 map 实例 |



| 属性名  | 类型     | 必须  | 默认值 | 说明                     |
| ------- | -------- | ----- | ------ | ------------------------ |
| type    | String[] | true  | null   | 天地图提供的数据图层数组 |
| proj    | String   | true  | null   | 天地图支持的投影坐标系   |
| key     | String   | true  | null   | 开发者秘钥               |
| url     | String   | true  | null   | 天地图的基础URL          |
| maxZoom | Number   | false | 18     | 最大放大级别             |



```javascript
Tmap.useTianDiTu({
    type: ['vec', 'cva'],
    proj: 'EPSG:4326',
    key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    url: 'http://t{0-7}.tianditu.gov.cn/'
})
```



##### useWMTS

| 方法名           | 返回 | 说明                                             |
| ---------------- | ---- | ------------------------------------------------ |
| useWMTS(options) | null | 创建使用 WMTS 服务的 Layer,并自动添加到 map 实例 |



| 属性名    | 类型   | 必须  | 默认值    | 说明                         |
| --------- | ------ | ----- | --------- | ---------------------------- |
| type      | String | true  | null      | WMTS服务提供的图层样式       |
| proj      | String | false | EPSG:3857 | WMTS服务提供的投影坐标系类型 |
| matrixSet | String | false | null      | 矩阵集                       |
| format    | String | false | null      | 图像格式                     |
| key       | String | false | null      | 开发者秘钥                   |
| url       | String | true  | null      | WMTS服务的基础url            |
| maxZoom   | Number | false | 18        | 最大放大级别                 |



```javascript
Tmap.useWMTS({
    type: 'bigemap.other',
    matrixSet: '7to15',
    proj: 'epsg:3857',
    format: 'image/png',
    url: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
})
```



##### addView

| 方法名           | 返回 | 说明                        |
| ---------------- | ---- | --------------------------- |
| addView(options) | null | 用于添加视图层到 map 实例上 |



| 属性名  | 类型     | 必须  | 默认值    | 说明                       |
| ------- | -------- | ----- | --------- | -------------------------- |
| proj    | String   | false | EPSG:3857 | view视图的层的投影坐标系   |
| center  | Number[] | false | [0, 0]    | 视图层的坐标系中心点       |
| zoom    | Number   | false | 0         | 初始化视图时的默认放大级别 |
| minZoom | Number   | false | 0         | 视图层的最小缩放级别       |
| maxZoom | Number   | false | 18        | 视图层的最大缩放级别       |



```javascript
Tmap.addView({
    center: [115.904642, 28.680854],
    proj: 'EPSG:4326',
    zoom: 15,
    minZoom: 7,
    maxZoom: 18
})
```



##### removeMap

| 方法名      | 返回 | 说明         |
| ----------- | ---- | ------------ |
| removeMap() | null | 清除地图图层 |



##### addLayer

| 方法名            | 返回 | 说明                           |
| ----------------- | ---- | ------------------------------ |
| addLayer(options) | null | 用于添加 Layer 层到 map 实例上 |



| 参数名  | 类型             | 必须 | 默认值 | 说明                                             |
| ------- | ---------------- | ---- | ------ | ------------------------------------------------ |
| options | Layer \| Layer[] | true | null   | openlayer 的 Layer 实例或者 Layer 实例组成的数组 |



##### searchLayer

| 方法名               | 返回                                          | 说明                     |
| -------------------- | --------------------------------------------- | ------------------------ |
| searchLayer(options) | {layer: Layer, index: Number, ol_uid: Number} | 根据名字,查询 Layer 实例 |



| 参数名  | 类型   | 必须 | 默认值 | 说明             |
| ------- | ------ | ---- | ------ | ---------------- |
| options | String | true | null   | Layer 实例的名字 |



##### searchLayers

| 方法名                | 返回    | 说明                     |
| --------------------- | ------- | ------------------------ |
| searchLayers(options) | Layer[] | 根据名字,查询 Layer 实例 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                             |
| ------- | ------------------ | ---- | ------ | -------------------------------- |
| options | String \| String[] | true | null   | Layer 实例的名字或名字组成的数组 |



##### removeLayer

| 方法名               | 返回 | 说明                         |
| -------------------- | ---- | ---------------------------- |
| removeLayer(options) | null | 从 map 实例上移除 Layer 实例 |



| 参数名  | 类型             | 必须 | 默认值 | 说明                         |
| ------- | ---------------- | ---- | ------ | ---------------------------- |
| options | Layer \| Layer[] | true | null   | Layer 实例或者实例组成的数组 |



##### addOverlay

| 方法名              | 返回 | 说明                       |
| ------------------- | ---- | -------------------------- |
| addOverlay(options) | null | 添加 Overlay 到 map 实例上 |



| 参数名  | 类型                 | 必须 | 默认值 | 说明                           |
| ------- | -------------------- | ---- | ------ | ------------------------------ |
| options | Overlay \| Overlay[] | true | null   | Overlay 实例或者实例组成的数组 |



##### searchOverlay

| 方法名                 | 返回                              | 说明                       |
| ---------------------- | --------------------------------- | -------------------------- |
| searchOverlay(options) | {overlay: Overlay, index: Number} | 根据名字,查询 Overlay 实例 |



| 参数名  | 类型   | 必须 | 默认值 | 说明               |
| ------- | ------ | ---- | ------ | ------------------ |
| options | String | true | null   | Overlay 实例的名字 |



##### searchOverlays

| 方法名                  | 返回      | 说明                       |
| ----------------------- | --------- | -------------------------- |
| searchOverlays(options) | Overlay[] | 根据名字,查询 Overlay 实例 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                                 |
| ------- | ------------------ | ---- | ------ | ------------------------------------ |
| options | String \| String[] | true | null   | Overlay 实例的名字或者名字组成的数组 |



##### removeOverlay

| 方法名          | 返回 | 说明                  |
| --------------- | ---- | --------------------- |
| removeOverlay() | null | 移除全部 Overlay 实例 |



##### addInteraction

| 方法名                  | 返回 | 说明                         |
| ----------------------- | ---- | ---------------------------- |
| addInteraction(options) | null | 添加 Interaction 到 map 实例 |



| 参数名  | 类型                         | 必须 | 默认值 | 说明                               |
| ------- | ---------------------------- | ---- | ------ | ---------------------------------- |
| options | Interaction \| Interaction[] | true | null   | Interaction 实例或者实例组成的数组 |



##### searchInteraction

| 方法名                     | 返回                                                      | 说明                           |
| -------------------------- | --------------------------------------------------------- | ------------------------------ |
| searchInteraction(options) | {interaction: Interaction, index: Number, ol_uid: Number} | 根据名字,查询 Interaction 实例 |



| 参数名  | 类型   | 必须 | 默认值 | 说明                   |
| ------- | ------ | ---- | ------ | ---------------------- |
| options | String | true | null   | Interaction 实例的名字 |



##### searchInteractions

| 方法名                      | 返回          | 说明                           |
| --------------------------- | ------------- | ------------------------------ |
| searchInteractions(options) | Interaction[] | 根据名字,查询 Interaction 实例 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                                     |
| ------- | ------------------ | ---- | ------ | ---------------------------------------- |
| options | String \| String[] | true | null   | Interaction 实例的名字或者名字组成的数组 |



##### removeInteraction

| 方法名                     | 返回 | 说明                               |
| -------------------------- | ---- | ---------------------------------- |
| removeInteraction(options) | null | 从 map 实例上移除 Interaction 实例 |



| 参数名  | 类型                         | 必须 | 默认值 | 说明                               |
| ------- | ---------------------------- | ---- | ------ | ---------------------------------- |
| options | Interaction \| Interaction[] | true | null   | Interaction 实例或者实例组成的数组 |



##### clear

| 方法名  | 返回 | 说明                                                         |
| ------- | ---- | ------------------------------------------------------------ |
| clear() | null | 清除 MapInit 实例的 layers, overlayers, interactions  仓库中的全部实例 |



##### setCenter

| 方法名             | 返回 | 说明               |
| ------------------ | ---- | ------------------ |
| setCenter(options) | null | 设置视图层的中心点 |



| 参数名  | 类型     | 必须 | 默认值 | 说明       |
| ------- | -------- | ---- | ------ | ---------- |
| options | Number[] | true | null   | [lon, lat] |



##### setZoom

| 方法名           | 返回 | 说明                   |
| ---------------- | ---- | ---------------------- |
| setZoom(options) | null | 设置视图层的 zoom 级别 |



| 参数名  | 类型   | 必须 | 默认值 | 说明                 |
| ------- | ------ | ---- | ------ | -------------------- |
| options | Number | true | null   | 设置 View 的显示级别 |



##### getLonLat

| 方法名           | 返回     | 说明               |
| ---------------- | -------- | ------------------ |
| getLonLat(event) | Number[] | 获取点击位置的坐标 |



| 参数名 | 类型                     | 必须 | 默认值 | 说明                                             |
| ------ | ------------------------ | ---- | ------ | ------------------------------------------------ |
| event  | Event \| MapBrowserEvent | true | null   | Event 事件或者 openlayer 的 MapBrowserEvent 事件 |



```javascript
Tmap.on('click', e => {
    console.log(Tmap.getLonLat(e))
})

document.getElementById('map').addEventListener('click', e => {
    console.log(Tmap.getLonLat(e))
})
```



##### getZoom

| 方法名    | 返回   | 说明         |
| --------- | ------ | ------------ |
| getZoom() | Number | 获取缩放级别 |



##### zoomChange

| 方法名                          | 返回 | 说明             |
| ------------------------------- | ---- | ---------------- |
| zoomChange((zoom, event) => {}) | key  | 当滚轮滚动时触发 |



##### on

| 方法名                  | 返回      | 说明     |
| ----------------------- | --------- | -------- |
| on(eventName, callBack) | EventsKey | 注册事件 |



| 参数名    | 类型               | 必须 | 默认值 | 说明               |
| --------- | ------------------ | ---- | ------ | ------------------ |
| eventName | String \| String[] | true | null   | 需要注册的事件类型 |
| callBack  | Function           | true | null   | 回调函数           |



```javascript
const key = on('click', e => console.log(e))
```



##### unon

| 方法名    | 返回 | 说明         |
| --------- | ---- | ------------ |
| unon(key) | null | 解除事件注册 |



| 参数名 | 类型                     | 必须 | 默认值 | 说明                    |
| ------ | ------------------------ | ---- | ------ | ----------------------- |
| key    | EventsKey \| EventsKey[] | true | null   | opoenlayer 的 Eventskey |



##### getCoordinateFromFeature

| 方法名                            | 返回                    | 说明                                |
| --------------------------------- | ----------------------- | ----------------------------------- |
| getCoordinateFromFeature(options) | Number[] \| Number[] [] | 从传入的 Feature 实例中获取坐标信息 |



| 参数名  | 类型                 | 必须 | 默认值 | 说明                                        |
| ------- | -------------------- | ---- | ------ | ------------------------------------------- |
| options | Feature \| Feature[] | true | null   | openlayer 的 Feature 实例或者实例组成的数组 |



#### 创建工具实例的方法

| 名称         | 参数                            | 说明                       |
| ------------ | ------------------------------- | -------------------------- |
| Text         | Object 具体查看 Text 类         | 用于创建 Text 实例         |
| GridPolygon  | Object 具体查看 GridPolygon 类  | 用于创建 GridPolygon 实例  |
| IconMarker   | Object 具体查看 IconMarker 类   | 用于创建 IconMarker 实例   |
| DomMarker    | Object 具体查看 DomMarker 类    | 用于创建 DomMarker 实例    |
| Trajectory   | Object 具体查看 Trajectory 类   | 用于创建 Trajectory 实例   |
| HeatMap      | Object 具体查看 HeatMap 类      | 用于创建 HeatMap 实例      |
| DrawLine     | Object 具体查看 DrawLine 类     | 用于创建 DrawLine 实例     |
| DrawModify   | Object 具体查看 DrawModify 类   | 用于创建 DrawModify 实例   |
| ClusterPoint | Object 具体查看 ClusterPoint 类 | 用于创建 ClusterPoint 实例 |



### Text 类

用于创建文字标注



#### 创建实例

| 构造函数           | 返回 | 说明             |
| ------------------ | ---- | ---------------- |
| Tmap.Text(options) | Text | 初始化 Text 实例 |



| 属性名     | 类型                          | 必须  | 默认值               | 说明                                     |
| ---------- | ----------------------------- | ----- | -------------------- | ---------------------------------------- |
| name       | String                        | false | fontLayer            | Layer 层的名字                           |
| fontStyle  | String                        | false | 15px Microsoft YaHei | 标注的字体样式,与 css 中的 font 字段一样 |
| offset     | Number[]                      | false | [0, 0]               | 标注字体的偏移量                         |
| color      | String                        | false | #333                 | 标注字体的颜色                           |
| background | {color: String, url?: String} | false | null                 | 标注的背景颜色或者图案                   |
| condition  | {color: String, url?: String} | false | null                 | 点击或者选择时,标注的背景颜色或者图案    |



```javascript
const text = Tmap.Text({
    name: 'text',
    color: '#fff',
    background: {
        color: 'blue'
    },
    condition: {}
})

Tmap.addLayer(text.layer)
```



#### 实例属性

| 属性名      | 说明                   |
| ----------- | ---------------------- |
| layer       | 实例的 Layer           |
| interaction | 实例的全部 Interaction |
| feature     | 实例的全部 Feature     |



#### 实例方法

##### create

| 方法名          | 返回                               | 说明                     |
| --------------- | ---------------------------------- | ------------------------ |
| create(options) | {layer: Layer, feature: Feature[]} | 创建 Icon 类型的文字标注 |



| 参数名  | 类型                                     | 必须 | 默认值 | 说明                       |
| ------- | ---------------------------------------- | ---- | ------ | -------------------------- |
| options | CreateTextOptions \| CreateTextOptions[] | true | null   | 一个对象或者对象组成的数组 |

| 属性名 | 类型     | 必须 | 默认值 | 说明           |
| ------ | -------- | ---- | ------ | -------------- |
| point  | Number[] | true | null   | 标注的位置     |
| name   | String   | true | null   | Feature 的名字 |
| label  | String   | true | null   | 标注的提示文字 |



```javascript
const a = [
  [115.890445, 28.674833],
  [115.904642, 28.680854],
  [115.898654, 28.684034],
  [115.899881, 28.68228]
]
a.forEach((item, index) => {
  text.create({ label: `测试${index + 1}`, point: item })
})
```



##### addSelect

| 方法名                    | 返回        | 说明             |
| ------------------------- | ----------- | ---------------- |
| addSelect(name, callBack) | Interaction | 用于创建选择事件 |



| 参数名   | 类型                         | 必须  | 默认值 | 说明                   |
| -------- | ---------------------------- | ----- | ------ | ---------------------- |
| name     | String \| undefind \| null   | false | null   | Interaction 实例的名字 |
| callBack | Function \| undefined \| nul | false | null   | 回调函数               |



```javascript
const testSelect = text.addSelect('testSelect', e => {
    console.log(e)
})

Tmap.addInteraction(testSelect)
```



##### addClick

| 方法名                   | 返回        | 说明             |
| ------------------------ | ----------- | ---------------- |
| addClick(name, callBack) | Interaction | 用于创建点击事件 |



| 参数名   | 类型                          | 必须  | 默认值 | 说明                   |
| -------- | ----------------------------- | ----- | ------ | ---------------------- |
| name     | String \| undefind \| null    | false | null   | Interaction 实例的名字 |
| callBack | Function \| undefined \| null | false | null   | 回调函数               |



```javascript
const textClick = text.addClick('testClick', e => {
    console.log(e)
})

Tmap.addInteraction(textClick)
```



##### searchFeature

| 方法名                 | 返回                                              | 说明                      |
| ---------------------- | ------------------------------------------------- | ------------------------- |
| searchFeature(options) | {feature: Feature, index: Number, ol_uid: Number} | 根据名字查询 Feature 实例 |



| 参数名  | 类型   | 必须 | 默认值 | 说明               |
| ------- | ------ | ---- | ------ | ------------------ |
| options | String | true | null   | Feature 实例的名字 |



##### searchFeatures

| 方法名                   | 返回      | 说明                      |
| ------------------------ | --------- | ------------------------- |
| seasrchFeatures(options) | Feature[] | 根据名字查询 Feature 实例 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                                 |
| ------- | ------------------ | ---- | ------ | ------------------------------------ |
| options | String \| String[] | true | null   | Feature 实例的名字或者名字组成的数组 |



##### removeFeature

| 方法名                 | 返回 | 说明              |
| ---------------------- | ---- | ----------------- |
| removeFeature(options) | null | 移除 Feature 实例 |



| 参数名  | 类型                         | 必须 | 默认值 | 说明                           |
| ------- | ---------------------------- | ---- | ------ | ------------------------------ |
| options | Interaction \| Interaction[] | true | null   | Feature 实例或者实例组成的数组 |



##### searchInteraction

| 方法名                     | 返回                                       | 说明                          |
| -------------------------- | ------------------------------------------ | ----------------------------- |
| searchInteraction(options) | {interaction: Interaction, ol_uid: Number} | 根据名字查询 Interaction 实例 |



| 参数名  | 类型   | 必须 | 默认值 | 说明                   |
| ------- | ------ | ---- | ------ | ---------------------- |
| options | String | true | null   | Interaction 实例的名字 |



##### searchInteractions

| 方法名                      | 返回          | 说明                          |
| --------------------------- | ------------- | ----------------------------- |
| searchInteractions(options) | Interaction[] | 根据名字查询 Interaction 实例 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                                     |
| ------- | ------------------ | ---- | ------ | ---------------------------------------- |
| options | String \| String[] | true | null   | Interaction 实例的名字或者名字组成的数组 |



### GridPolygon 类

用于创建网格



#### 创建实例

| 构造函数                  | 返回        | 说明                    |
| ------------------------- | ----------- | ----------------------- |
| Tmap.GridPolygon(options) | GridPolygon | 初始化 GridPolygon 实例 |



| 属性名      | 类型                                               | 必须  | 默认值                                                 | 说明               |
| ----------- | -------------------------------------------------- | ----- | ------------------------------------------------------ | ------------------ |
| name        | String                                             | false | gridPolygon                                            | Layer 层的名字     |
| opacity     | Number                                             | false | 1                                                      | Layer 层的透明度   |
| stroke      | {color: String, width: Number, lineDash: Number[]} | false | {color:rgba(0, 0, 255, 0.8),width: 0, lineDash:[0,0] } | 网格的边框配置     |
| hoverColor  | String                                             | false | rgba(0, 255, 0, 0.4)                                   | 鼠标选中时的颜色   |
| fontColor   | String                                             | false | #333                                                   | 标注字体颜色       |
| fontStyle   | String                                             | false | 15px Microsoft YaHei                                   | 标注字体样式       |
| minZoomShow | Number                                             | false | 0                                                      | 标注的最小显示级别 |



```javascript
cosnt gridPolygon = Tmap.GridPolygon({
    name: 'gridPolygon',
    stroke: {
        color: 'blue',
        width: 6,
        lineDash: [10, 10]
    },
    hoveColor: 'yellow',
    fontColor: '#333',
    fontStyle: '20px Microsoft YaHei',
    minZoomShow: 15
})

Tmap.addLayer(gridPolygon.layer)
```



#### 实例属性

| 属性名      | 说明                   |
| ----------- | ---------------------- |
| layer       | 实例的 Layer           |
| interaction | 实例的全部 Interaction |
| feature     | 实例的全部 Feature     |



#### 实例方法

##### preventDefault

| 方法名           | 返回 | 说明                   |
| ---------------- | ---- | ---------------------- |
| preventDefault() | null | 禁止与允许鼠标右键事件 |



##### create

| 方法名          | 返回                               | 说明     |
| --------------- | ---------------------------------- | -------- |
| create(options) | {layer: Layer, feature: Feature[]} | 创建网格 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                 |
| ------- | ------------------ | ---- | ------ | -------------------- |
| options | Object \| Object[] | true | null   | 网格的配置或配置数组 |

| 属性名 | 类型           | 必须 | 默认 | 说明               |
| ------ | -------------- | ---- | ---- | ------------------ |
| point  | Number[] [] [] | true | null | 网格的坐标数组     |
| name   | String         | true | null | Feature 实例的名字 |
| color  | String         | true | null | 网格内的填充颜色   |
| label  | String         | true | null | 网格的标注         |



```javascript
const one = [
  [115.904642, 28.680854],
  [115.90469, 28.680417],
  [115.905204, 28.680444],
  [115.905222, 28.680264],
  [115.905566, 28.680263],
  [115.905616, 28.680216],
  [115.905634, 28.680041],
  [115.906109, 28.680052],
  [115.906133, 28.680499],
  [115.905709, 28.680494],
  [115.905693, 28.680914],
  [115.904642, 28.680854]
]

gridPolygon.create({
    point: [one],
    name: 'test',
    label: 'test',
    color: 'blue'
})
```



##### addSelect

| 方法名                    | 返回        | 说明                                                         |
| ------------------------- | ----------- | ------------------------------------------------------------ |
| addSelect(callBack, name) | Interaction | 添加选择功能, 选择高亮功能, 需要配置 GridPolygon 实例的 hoverColor 属性 |



| 参数名   | 类型     | 必须  | 默认值 | 说明               |
| -------- | -------- | ----- | ------ | ------------------ |
| callBack | Function | false | null   | 回调函数           |
| name     | String   | false | null   | Interaction 的名字 |



##### addClick

| 方法名                   | 返回        | 说明             |
| ------------------------ | ----------- | ---------------- |
| addClick(callBack, name) | Interaction | 添加鼠标左键事件 |



| 参数名   | 类型     | 必须  | 默认值 | 说明               |
| -------- | -------- | ----- | ------ | ------------------ |
| callBack | Function | false | null   | 回调函数           |
| name     | String   | false | null   | Interaction 的名字 |



##### addRightClick

| 方法名                        | 返回        | 说明             |
| ----------------------------- | ----------- | ---------------- |
| addRightClick(callBack, name) | Interaction | 添加鼠标右键功能 |



| 参数名   | 类型     | 必须  | 默认值 | 说明               |
| -------- | -------- | ----- | ------ | ------------------ |
| callBack | Function | false | null   | 回调函数           |
| name     | String   | false | null   | Interaction 的名字 |



```javascript
gridPolygon.preventDefault()

const addRightClick = gridPolygon.addRightClick('test', e => {console.log(e)})

Tmap.addInteraction(addRightClick)
```



##### searchFeature

| 方法名                 | 返回                                              | 说明                      |
| ---------------------- | ------------------------------------------------- | ------------------------- |
| searchFeature(options) | {feature: Feature, index: Number, ol_uid: Number} | 根据名字查询 Feature 实例 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                                 |
| ------- | ------------------ | ---- | ------ | ------------------------------------ |
| options | String \| String[] | true | null   | Feature 实例的名字或者名字组成的数组 |



##### searchFeatures

| 方法名                  | 返回      | 说明                      |
| ----------------------- | --------- | ------------------------- |
| searchFeatures(options) | Feature[] | 根据名字查询 Feature 实例 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                                 |
| ------- | ------------------ | ---- | ------ | ------------------------------------ |
| options | String \| String[] | true | null   | Feature 实例的名字或者名字组成的数组 |



##### removeFeature

| 方法名                 | 返回 | 说明              |
| ---------------------- | ---- | ----------------- |
| removeFeature(options) | null | 移除 Feature 实例 |



| 参数名  | 类型                         | 必须 | 默认值 | 说明                           |
| ------- | ---------------------------- | ---- | ------ | ------------------------------ |
| options | Interaction \| Interaction[] | true | null   | Feature 实例或者实例组成的数组 |



##### searchInteraction

| 方法名                     | 返回                                       | 说明                          |
| -------------------------- | ------------------------------------------ | ----------------------------- |
| searchInteraction(options) | {interaction: Interaction, ol_uid: Number} | 根据名字查询 Interaction 实例 |



| 参数名  | 类型   | 必须 | 默认值 | 说明                   |
| ------- | ------ | ---- | ------ | ---------------------- |
| options | String | true | null   | Interaction 实例的名字 |



##### searchInteractions

| 方法名                      | 返回          | 说明                          |
| --------------------------- | ------------- | ----------------------------- |
| searchInteractions(options) | Interaction[] | 根据名字查询 Interaction 实例 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                                     |
| ------- | ------------------ | ---- | ------ | ---------------------------------------- |
| options | String \| String[] | true | null   | Interaction 实例的名字或者名字组成的数组 |



##### getCenterCoordinates

| 方法名                        | 返回     | 说明                  |
| ----------------------------- | -------- | --------------------- |
| getCenterCoordinates(options) | Number[] | 获取 Feature 的中心点 |



| 属性名  | 类型    | 必须 | 默认值 | 说明                                                |
| ------- | ------- | ---- | ------ | --------------------------------------------------- |
| options | Feature | true | null   | Feature 实例, 本类型可以使用 feature 属性返回的数据 |



### IconMarker 类

创建 Icon 类型的标注



#### 创建实例

| 构造函数                 | 返回       | 说明                 |
| ------------------------ | ---------- | -------------------- |
| Tmap.IconMarker(options) | IconMarker | 初始化 IconMarker 类 |



| 属性名    | 类型     | 必须  | 默认值               | 说明               |
| --------- | -------- | ----- | -------------------- | ------------------ |
| iconUrl   | String   | true  | null                 | 需要加载的图标地址 |
| offset    | Number[] | false | [0, 0]               | 标注字体的偏移量   |
| fontStyle | String   | false | 15px Microsoft YaHei | 标注字体的样式     |
| fontColor | String   | false | #333                 | 标注字体的颜色     |



```javascript
const iconMarker = Tmap.IconMarker({
    iconUrl: 'http://www.xxxxx.com/xxxxxxxxxxxxx',
    offset: [0, 10],
    fontStyle: '20px Microsoft YaHei',
    fontColor: 'yellow'
})

Tmap.addLayer(iconMarker.layer)
```



#### 实例属性

| 属性名      | 说明                   |
| ----------- | ---------------------- |
| layer       | 实例的 Layer           |
| interaction | 实例的全部 Interaction |
| feature     | 实例的全部 Feature     |



#### 实例方法

##### create

| 方法名          | 返回                               | 说明                     |
| --------------- | ---------------------------------- | ------------------------ |
| create(options) | {layer: Layer, feature: Feature[]} | 创建Icon点类型的图片标注 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                   |
| ------- | ------------------ | ---- | ------ | ---------------------- |
| options | Object \| Object[] | true | null   | 标注的配置或者配置数组 |

| 属性名 | 类型     | 必须 | 默认值 | 说明                  |
| ------ | -------- | ---- | ------ | --------------------- |
| point  | Number[] | true | null   | 标注的坐标位置,[x, y] |
| name   | String   | true | null   | Feature 实例的名字    |
| label  | String   | true | null   | 标注的文字提示        |



```javascript
const one = [115.904642, 28.680854]

iconMarker.create({
    point: one,
    name: 'test',
    label: 'testOne'
})
```



##### addClick

| 方法名                   | 返回        | 说明         |
| ------------------------ | ----------- | ------------ |
| addClick(callBack, name) | Interaction | 添加鼠标事件 |



| 参数名   | 类型     | 必须 | 默认值 | 说明                   |
| -------- | -------- | ---- | ------ | ---------------------- |
| callBack | Function | true | null   | 回调函数               |
| name     | String   | true | null   | Interaction 实例的名字 |



##### createAlert

| 方法名               | 返回        | 说明              |
| -------------------- | ----------- | ----------------- |
| createAlert(options) | Interaction | 用于创建 Dom 弹框 |



| 参数名  | 类型   | 必须 | 默认值 | 说明     |
| ------- | ------ | ---- | ------ | -------- |
| options | Object | true | null   | 配置详情 |

| 属性名    | 类型              | 必须  | 默认值      | 说明                                      |
| --------- | ----------------- | ----- | ----------- | ----------------------------------------- |
| innerHTML | String \| Element | true  | null        | Dom 字符串模板或者 Dom 实例对象           |
| callBack  | Function          | true  | null        | 回调函数,返回{zoom: Number, item: Object} |
| name      | String            | false | createAlert | Interaction 实例的名字                    |
| minZoom   | Number            | false | 18          | 最小可点击级别                            |



```javascript
iconMarker.createAlert({
    innerHTML: '<div>123</div>',
    callBack: (e) => {console.log(e)},
    name: 'testCreateAlert',
    minZoom: 16
})
```





##### searchFeature

| 方法名                 | 返回                                              | 说明                      |
| ---------------------- | ------------------------------------------------- | ------------------------- |
| searchFeature(options) | {feature: Feature, index: Number, ol_uid: Number} | 根据名字查询 Feature 实例 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                                 |
| ------- | ------------------ | ---- | ------ | ------------------------------------ |
| options | String \| String[] | true | null   | Feature 实例的名字或者名字组成的数组 |



##### searchFeatures

| 方法名                  | 返回      | 说明                                 |
| ----------------------- | --------- | ------------------------------------ |
| searchFeatures(options) | Feature[] | Feature 实例的名字或者名字组成的数组 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                                 |
| ------- | ------------------ | ---- | ------ | ------------------------------------ |
| options | String \| String[] | true | null   | Feature 实例的名字或者名字组成的数组 |



##### removeFeature

| 方法名                 | 返回 | 说明              |
| ---------------------- | ---- | ----------------- |
| removeFeature(options) | null | 移除 Feature 实例 |



| 参数名  | 类型                         | 必须 | 默认值 | 说明                           |
| ------- | ---------------------------- | ---- | ------ | ------------------------------ |
| options | Interaction \| Interaction[] | true | null   | Feature 实例或者实例组成的数组 |



##### searchInteraction

| 方法名                     | 返回                                       | 说明                          |
| -------------------------- | ------------------------------------------ | ----------------------------- |
| searchInteraction(options) | {interaction: Interaction, ol_uid: Number} | 根据名字查询 Interaction 实例 |



| 参数名  | 类型   | 必须 | 默认值 | 说明                   |
| ------- | ------ | ---- | ------ | ---------------------- |
| options | String | true | null   | Interaction 实例的名字 |



##### searchInteractions

| 方法名                      | 返回          | 说明                          |
| --------------------------- | ------------- | ----------------------------- |
| searchInteractions(options) | Interaction[] | 根据名字查询 Interaction 实例 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                                     |
| ------- | ------------------ | ---- | ------ | ---------------------------------------- |
| options | String \| String[] | true | null   | Interaction 实例的名字或者名字组成的数组 |



### DomMarker 类

创建Dom类型的标注



#### 创建实例

| 构造函数                | 返回      | 说明                    |
| ----------------------- | --------- | ----------------------- |
| Tmap.DomMarker(options) | DomMarker | 初始化 DomMarker 类实例 |



| 属性名    | 类型     | 必须  | 默认值 | 说明                           |
| --------- | -------- | ----- | ------ | ------------------------------ |
| offset    | Number[] | false | [0, 0] | Overlay 整体偏移量, [x, y]     |
| innerHTML | Sring    | true  | null   | Dom 字符串模板,或者 Dom 实例   |
| useTitle  | Boolean  | false | false  | 是否使用 dom 标签的 title 属性 |



```javascript
const domeMarker = Tmap.DomMarker({
    offset: [0, 10],
    innerHtML: `<div><img src="http://www.xxxxxxxx.com/xxxxxxx" /></div>`,
    useTitle: true
})

const domeMarker = Tmap.DomMarker({
    offset: [0, 10],
    innerHTML: document.getElementById('Dom'),
    useTitle: true
})
```



#### 实例属性

| 属性名   | 说明           |
| -------- | -------------- |
| overlays | Overlay 的数组 |



#### 实例方法

##### create

| 方法名          | 返回                 | 说明              |
| --------------- | -------------------- | ----------------- |
| create(options) | {overlay: Overlay[]} | 创建 Overlay 实例 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                 |
| ------- | ------------------ | ---- | ------ | -------------------- |
| options | Object \| Object[] | true | null   | 标注的配置或配置数组 |

| 属性名      | 类型                           | 必须  | 默认值                             | 说明                         |
| ----------- | ------------------------------ | ----- | ---------------------------------- | ---------------------------- |
| name        | String                         | true  | null                               | Overlay 实例的名字           |
| id          | String                         | true  | null                               | Dom 容器的 Id                |
| point       | Number[]                       | true  | null                               | Dom 标注的位置               |
| positioning | String                         | false | bottom-center                      | dom 对于 position 的定位方式 |
| label       | String                         | true  | null                               | Dom 标注的提示               |
| innerHTML   | Element \| String \| undefined | false | null                               | dom 或者  dom 字符串模板     |
| className   | String                         | false | ol-overlay-container ol-selectable | 最外层 dom 的 css 类名       |



```javascript
domeMarker.create({
    name: 'test',
    id: 'testDom',
    point: [115.904642, 28.680854]
})

Tmap.addOverlay(domMarker.overlays)
```



##### addClick

| 方法名             | 返回        | 说明     |
| ------------------ | ----------- | -------- |
| addClick(callBack) | Interaction | 添加事件 |



| 参数名   | 类型     | 必须 | 默认值 | 说明     |
| -------- | -------- | ---- | ------ | -------- |
| callBack | Function | true | null   | 回调函数 |



##### searchOverlay

| 方法名                 | 返回                              | 说明                      |
| ---------------------- | --------------------------------- | ------------------------- |
| searchOverlay(options) | {overlay: Overlay, index: Number} | 根据名字查询 Overlay 实例 |



| 参数名  | 类型   | 必须 | 默认值 | 说明               |
| ------- | ------ | ---- | ------ | ------------------ |
| options | String | true | null   | Overlay 实例的名字 |



##### searchOverlays

| 方法名                  | 返回      | 说明                      |
| ----------------------- | --------- | ------------------------- |
| searchOverlays(options) | Overlay[] | 根据名字查询 Overlay 实例 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                                 |
| ------- | ------------------ | ---- | ------ | ------------------------------------ |
| options | String \| String[] | true | null   | Overlay 实例的名字或者名字组成的数组 |



##### removeOverlay

| 方法名                 | 返回 | 说明              |
| ---------------------- | ---- | ----------------- |
| removeOverlay(options) | null | 移除 Overlay 实例 |



| 参数名  | 类型                 | 必须 | 默认值 | 说明                           |
| ------- | -------------------- | ---- | ------ | ------------------------------ |
| options | Overlay \| Overlay[] | true | null   | Overlay 实例或者实例组成的数组 |



### Trajectory 类

创建轨迹动画



#### 创建实例

| 构造函数                 | 返回       | 说明                   |
| ------------------------ | ---------- | ---------------------- |
| Tmap.Trajectory(options) | Trajectory | 初始化 Trajectory 实例 |



| 属性名      | 类型                                                         | 必须  | 默认值                                                       | 说明                        |
| ----------- | ------------------------------------------------------------ | ----- | ------------------------------------------------------------ | --------------------------- |
| iconUrl     | String                                                       | true  | null                                                         | 动画图片吧的 Url 地址       |
| name        | String                                                       | true  | null                                                         | Layer 实例的名字            |
| style       | {strokeWidth: Number,markColor: String strokeColor: String, lineDash: Number[], lineDashColor: String, iconSize: Number} | false | {strokeWidth: 5, markColor: '#000' strokeColor: '#fff', lineDash: [10, 10], lineDashColor: '#000', iconSize: 1} | 路径的线段样式              |
| speed       | Number                                                       | false | 0.1                                                          | 动画速度                    |
| repeat      | Boolean                                                      | false | false                                                        | 是否重复                    |
| pointAmount | Number                                                       | false | 2                                                            | 路径上点的密度,数字越大越多 |



```javascript
const trajectory = Tmap.Trajectory({
    iconUrl: 'http://www.xxxxxxx.com/xxxxxxx',
    name: 'trajectoryText',
    speed: 0.2,
    repeat: true,
    style: {
        strokeWidth: 10,
        strokeColor: 'blue',
        markColor: 'red'
        lineDash: [20, 20],
        lineDashColor: 'yellow'
    }
})

Tmap.addLayer(trajectory.layer)
```



#### 实例属性

| 属性名 | 说明           |
| ------ | -------------- |
| route  | 获取轨迹的路径 |
| layer  | 实例的 Layer   |



#### 实例方法

##### create

| 方法名          | 返回                                | 说明         |
| --------------- | ----------------------------------- | ------------ |
| create(options) | {layer:  Layer, feature: Feature[]} | 创建轨迹动画 |



| 属性名  | 类型   | 必须 | 默认值 | 说明       |
| ------- | ------ | ---- | ------ | ---------- |
| options | Object | true | null   | 动画的配置 |

| 属性名 | 类型        | 必须 | 默认值 | 说明               |
| ------ | ----------- | ---- | ------ | ------------------ |
| name   | String      | true | null   | Feature 实例的名字 |
| route  | Number[] [] | true | null   | 轨迹路径的坐标     |



```javascript
const one = [
  [115.904642, 28.680854],
  [115.90469, 28.680417],
  [115.905204, 28.680444],
  [115.905222, 28.680264],
  [115.905566, 28.680263],
  [115.905616, 28.680216],
  [115.905634, 28.680041],
  [115.906109, 28.680052],
  [115.906133, 28.680499],
  [115.905709, 28.680494],
  [115.905693, 28.680914],
  [115.904642, 28.680854]
]

trajectory.create({
    name: 'tsetAnimation',
    route: one
})
```



##### start

| 方法名  | 返回 | 说明     |
| ------- | ---- | -------- |
| start() | null | 开始动画 |



```javascript
trajectory.start()
```



##### stop

| 方法名 | 返回 | 说明     |
| ------ | ---- | -------- |
| stop() | null | 停止动画 |



```javascript
trajectory.stop()
```



##### getCenterCoordinates

| 方法名                      | 返回     | 说明             |
| --------------------------- | -------- | ---------------- |
| getCenterCoordinates(route) | Number[] | 获取范围的中心点 |



| 属性名 | 类型            | 必须 | 默认值 | 说明                                              |
| ------ | --------------- | ---- | ------ | ------------------------------------------------- |
| route  | Array<Number[]> | true | null   | 范围的二维数组, 本实例可以采用route属性返回的数据 |



### HeatMap 类

创建热力图的工具类



#### 创建实例

| 构造函数              | 返回    | 说明                |
| --------------------- | ------- | ------------------- |
| Tmap.HeatMap(options) | HeatMap | 初始化 HeatMap 实例 |



| 属性名 | 类型   | 必须  | 默认值  | 说明             |
| ------ | ------ | ----- | ------- | ---------------- |
| name   | String | false | heatMap | Layer 实例的名字 |
| blur   | Number | false | 20      | 模糊尺寸半径     |
| radius | Number | false | 20      | 热点半径         |



```javascript
const heatMap = Tmap.HeatMap({
    name: 'testHeatMap',
    blur: 80,
    radius: 80
})

Tmap.addLayer(heatMap.layer)
```



**注意:** blur 与 radius 之间的差值不要大于20



#### 实例属性

| 属性名  | 说明               |
| ------- | ------------------ |
| layer   | 实例的 Layer       |
| feature | 实例的全部 Feature |



#### 实例方法

##### create

| 方法名          | 返回                               | 说明       |
| --------------- | ---------------------------------- | ---------- |
| create(options) | {layer: Layer, feature: Feature[]} | 创建热力图 |

| 参数名  | 类型               | 必须 | 默认值 | 说明                   |
| ------- | ------------------ | ---- | ------ | ---------------------- |
| options | Object \| Object[] | true | null   | 热力的配置或者配置数组 |



| 属性名 | 类型     | 必须  | 默认值 | 说明                       |
| ------ | -------- | ----- | ------ | -------------------------- |
| point  | Number[] | true  | null   | 热力图的坐标点             |
| weight | Number   | true  | null   | 热力图的权重,0 - 1范围之内 |
| name   | String   | false | null   | Feature 实例的名字         |



```javascript
heatMap.create({
    point: [115.904642, 28.680854],
    weight: 0.55,
    name: 'testHeatMap'
})
```



### DrawLine 类

用于在地图上手动添加轨迹



#### 创建实例

| 构造函数               | 返回     | 说明                 |
| ---------------------- | -------- | -------------------- |
| Tmap.DrawLine(options) | DrawLine | 初始化 DrawLine 实例 |



| 属性名  | 类型                                                         | 必须  | 默认值     | 说明                                              |
| ------- | ------------------------------------------------------------ | ----- | ---------- | ------------------------------------------------- |
| name    | String                                                       | false | drawLine   | Layer 实例和 Interaction 实例的名字               |
| iconUrl | String                                                       | false | null       | 节点图标的图片,如果没有,将使用 style 字段下的配置 |
| style   | {radius: Number, stroke: {width: Number, color: String}, width: Number, color: String} | false | {}         | 路径节点关键位置的样式,没有 iconUrl 字段时,才启用 |
| type    | 'LineString' \| 'Polygon'                                    | false | LineString | 可以画图的类型                                    |



```javascript
const drawLine = Tmap.DrawLine({
    name: 'testDrawLine',
    //iconUrl: 'http://www.xxxxxx.com/xxxxxx',
    type: 'LineString',
    style: {
        radius: 5,
        stroke: {
            width: 2,
            color: '#fff'
        },
        width: 5,
        color: 'red'
    }
})

Tmap.addLayer(drawLine.layer)
```



#### 实例属性

| 属性名      | 说明                   |
| ----------- | ---------------------- |
| layer       | 实例的 Layer           |
| interaction | 实例的全部 Interaction |



#### 实例方法

##### create

| 方法名   | 返回                                       | 说明       |
| -------- | ------------------------------------------ | ---------- |
| create() | {layer: Layer, interaction: Interaction[]} | 开始与重置 |



```javascript
const createDrawLine = drawLine.create()

// 添加控制层到 Map 实例上
Tmap.addInteraction(createDrawLine.interaction)
```





##### getValue

| 方法名     | 返回     | 说明                                 |
| ---------- | -------- | ------------------------------------ |
| getValue() | Number[] | 直接获取手动创建的图形点位置坐标数组 |



```javascript
const coordinates = drawLine.getValue()

console.log(coordinates)
```



**注意:** 此方法不是最优方案,但是也提供使用



##### rmLastPoint

| 方法名            | 返回        | 说明                                                |
| ----------------- | ----------- | --------------------------------------------------- |
| rmLastPoint(name) | Interaction | 在手动创建图形的时候,点击鼠标右键移除最后放置的点位 |



| 参数名 | 类型   | 必须  | 默认值     | 说明                   |
| ------ | ------ | ----- | ---------- | ---------------------- |
| name   | String | false | rightClick | Interaction 实例的名字 |



```javascript
const rmListPoint = drawLine.rmLastPoint('testRmLastPoint')

Tmap.addInteraction(rmListPoint)
```



##### stopDraw

| 方法名                   | 返回        | 说明                                                         |
| ------------------------ | ----------- | ------------------------------------------------------------ |
| stopDraw(name, callBack) | Interaction | 在创建图形的时候,双击鼠标左键,结束功能,并且把坐标数组通过回调函数传递出去 |



| 参数名   | 类型     | 必须  | 默认值   | 说明                        |
| -------- | -------- | ----- | -------- | --------------------------- |
| name     | String   | false | stopDraw | Interaction 实例的名字      |
| callBack | Function | false | null     | 回调函数,接受坐标数组为参数 |



```javascript
const stopDraw = drawLine.stopDraw('testStopDraw', (e) => {
    // e 为手动创建的图形坐标数组
    console.log(e)
    
    // 停止功能时,需要把 drawLine 中的 Interaction 从 Map 实例上移除
    Tmap.removeInteraction(createDrawLine.interaction)
})
```



##### searchInteraction

| 方法名                     | 返回                                                      | 说明                          |
| -------------------------- | --------------------------------------------------------- | ----------------------------- |
| searchInteraction(options) | {interaction: Interaction, index: Number, ol_uid: Number} | 根据名字查询 Interaction 实例 |



| 参数名  | 类型   | 必须 | 默认值 | 说明                   |
| ------- | ------ | ---- | ------ | ---------------------- |
| options | String | true | null   | Interaction 实例的名字 |



##### removeInteraction

| 方法名                     | 返回 | 说明                               |
| -------------------------- | ---- | ---------------------------------- |
| removeInteraction(options) | null | 移除 DrawLine 实例中的 Interaction |



| 参数名  | 类型                         | 必须 | 默认值 | 说明                               |
| ------- | ---------------------------- | ---- | ------ | ---------------------------------- |
| options | Interaction \| Interaction[] | true | null   | Interaction 实例或者实例组成的数组 |



**注意:** 使用stopDraw方法时,移除Map 实例上的Interaction,如果业务还需要继续使用 DrawLine 的功能,则需要同时移除 DrawLine 实例中的 Interaction 实例



#### 示例

```javascript
// 创建 DrawLine 实例
const drawLine = Tmap.DrawLine({
    name: 'testDrawLine',
    //iconUrl: 'http://www.xxxxxx.com/xxxxxx',
    type: 'LineString',
    style: {
        radius: 5,
        stroke: {
            width: 2,
            color: '#fff'
        },
        width: 5,
        color: 'red'
    }
})
const createDrawLine = drawLine.create()

// 添加 DrawLine 实例中的 Layer 到 Map 实例上
Tmap.addLayer(createDrawLine.layer)

// 设置鼠标右键删除最后一个坐标点
const rmLastPoint = drawLine.rmLastPoint('testRmLastPoint')

// 设置双击鼠标左键结束功能
const stopDraw = drawLine.stopDraw('testStopDraw', e => {
    // e 为手动创建的图形坐标数组
    console.log(e)
    
    // 停止功能时,需要把 drawLine 中的 Interaction 从 Map 实例上移除
    Tmap.removeInteraction(createDrawLine.interaction)
})

// 添加 Interaaction 到 Map 实例上
Tmap.addInteraction([createDrawLine.interaction, rmLastPoint, stopDraw])

// 重置
setTimeout(() => {
    const draw = drawLine.create()
    Tmap.addInteraction(draw.interaction)
}, 30 * 1000)

// 使用完功能后需要手动清除 Map 中的 Interaction
Tmap.removeInteraction([rmLastPoint, stopDraw])
```



### DrawModify 类

修改已创建的线段或者网格的工具



#### 创建实例

| 构造函数                 | 返回       | 说明                   |
| ------------------------ | ---------- | ---------------------- |
| Tmap.DrawModify(options) | DrawModify | 初始化 DrawModify 实例 |



| 属性名  | 类型                                                         | 必须  | 默认值 | 说明                                              |
| ------- | ------------------------------------------------------------ | ----- | ------ | ------------------------------------------------- |
| layer   | Layer                                                        | true  | null   | 需要修改的 Layer 实例                             |
| iconUrl | String                                                       | false | null   | 节点图标的图片,如果没有,将使用 style 字段下的配置 |
| style   | {radius: Number, width: Number, color: String,stroke: {width: Number, color: String}} | false | {}     | 路径节点关键位置的样式,没有 iconUrl 字段时,才启用 |



```javascript
const drawModify = Tmap.DrawModify({
    layer: LayerObject,
    iconUrl: 'http://www.xxxxxx.com/xxxxxxx',
    style: {
        radius: 5,
        width: 2,
        color: 'blue',
        stroke: {
            width: 4,
            color: 'yellow'
        }
    }
})
```



#### 实例属性

| 属性名      | 说明                 |
| ----------- | -------------------- |
| interaction | Interaction 实例数组 |



#### 实例方法

##### create

| 方法名   | 返回                         | 说明             |
| -------- | ---------------------------- | ---------------- |
| create() | {interaction: Interaction[]} | 用于创建修改图层 |



```javascript
const create = drawModify.create()

Tmap.addInteraction(drawModify.interaction)
```



##### stopModify

| 方法名                     | 返回        | 说明                                            |
| -------------------------- | ----------- | ----------------------------------------------- |
| stopModify(name, callBack) | Interaction | 双击鼠标左键获取源,回调函数的参数是需要修改的源 |



| 参数名   | 类型     | 必须 | 默认值 | 说明                            |
| -------- | -------- | ---- | ------ | ------------------------------- |
| name     | String   | true | null   | Interaction 实例的名字          |
| callBack | Function | true | null   | 回调函数,接受需要修改的源为参数 |



```javascript
drawModify.stopModify('testStopModify', e => {
    // e 为初始化 DrawModify 时, 传入 Layer 的源
    console.log(e)
    // 双击鼠标左键移除 Map 上的 Interaction 实例
    Tmap.removeInteraction(drawModify.interaction)
})
```



##### searchInteraction

| 方法名            | 返回                                                     | 说明                          |
| ----------------- | -------------------------------------------------------- | ----------------------------- |
| searchInteraction | {interacton: Interaction, index: Number, ol_uid: Number} | 根据名字查询 Interaction 实例 |



| 参数名  | 类型   | 必须 | 默认值 | 说明                   |
| ------- | ------ | ---- | ------ | ---------------------- |
| options | String | true | null   | Interaction 实例的名字 |



### ClusterPoint 类

点聚合的方法



#### 创建实例

| 构造函数                   | 返回         | 说明                     |
| -------------------------- | ------------ | ------------------------ |
| Tmap.ClusterPoint(options) | ClusterPoint | 初始化 ClusterPoint 实例 |



| 属性名    | 类型     | 必须  | 默认值               | 说明                     |
| --------- | -------- | ----- | -------------------- | ------------------------ |
| iconUrl   | String   | true  | null                 | 图标的 Url 地址          |
| name      | String   | false | clusterPoint         | Layer 层的名字           |
| fontStyle | String   | false | 15px Microsoft YaHei | 标注的字体样式           |
| fontColor | String   | false | #ffffff              | 标注的字体颜色           |
| offset    | Number[] | false | [0, 0]               | 标注字体的偏移量, [x, y] |
| distance  | Number   | false | 50                   | 要素将聚集在一起的距离   |



```javascript
const cluster = Tmap.ClusterPoint({
    iconUrl: 'http://www.xxxxxxx.com/xxxxxxx',
    fontStyle: '20px Microsoft YaHei',
    fontColor: 'blue',
    offset: [0, 10],
    distance: 100
})

Tmap.addLayer(cluster.layer)
```



#### 实例属性

| 属性名      | 说明                        |
| ----------- | --------------------------- |
| layer       | 实例的 Layer 实例           |
| interaction | 实例的 Interaction 实例仓库 |
| feature     | 实例的 Feature 实例仓库     |



#### 实例方法

##### create

| 方法名          | 返回                               | 说明     |
| --------------- | ---------------------------------- | -------- |
| create(options) | {layer: Layer, feature: Feature[]} | 创建聚合 |



| 参数名  | 类型               | 必须 | 默认值 | 说明                     |
| ------- | ------------------ | ---- | ------ | ------------------------ |
| options | Object \| Object[] | true | null   | 聚合点的配置或者配置数组 |

| 属性名 | 类型     | 必须 | 默认值 | 说明     |
| ------ | -------- | ---- | ------ | -------- |
| point  | Number[] | true | null   | 点的坐标 |
| id     | String   | true | null   | 点的ID   |



```javascript
const one = [
  [115.904642, 28.680854],
  [115.90469, 28.680417],
  [115.905204, 28.680444],
  [115.905222, 28.680264],
  [115.905566, 28.680263],
  [115.905616, 28.680216],
  [115.905634, 28.680041],
  [115.906109, 28.680052],
  [115.906133, 28.680499],
  [115.905709, 28.680494],
  [115.905693, 28.680914],
  [115.904642, 28.680854]
]

one.forEach((item, index) => {
    cluster.create({id: index, point: item})
})
```



##### wheel

| 方法名       | 返回                                        | 说明                        |
| ------------ | ------------------------------------------- | --------------------------- |
| wheel(event) | {zoom: Number, delta: Number, event: Event} | 通过 Event 获取鼠标滚轮事件 |



| 参数名 | 类型                     | 必须 | 默认值 | 说明       |
| ------ | ------------------------ | ---- | ------ | ---------- |
| event  | Event \| MapBrowserEvent | true | null   | Event 事件 |



```javascript
const wheel = Tmap.on('wheel', e => {
    const t = cluster.wheel(e)
    console.log(t)
})
```



##### addClick

| 方法名                           | 返回        | 说明             |
| -------------------------------- | ----------- | ---------------- |
| addClick(name,callBack, minZoom) | Intearction | 用于创建点击事件 |



| 参数名   | 类型     | 必须  | 默认值            | 说明                                      |
| -------- | -------- | ----- | ----------------- | ----------------------------------------- |
| name     | String   | false | clusterPointClick | Interaction 实例的名字                    |
| callBack | Function | false | null              | 回调函数,返回{zoom: Number, item: Object} |
| minZoom  | Number   | false | 18                | 最小可点击级别                            |



```javascript
cluster.addClick('testCreate', (e) => {console.log(e)}, 15)
```



**注意:** 因为此类是创建聚合,点击事件最好设置最小级别为创建地图时设置的视图最大级别(maxZoom)



##### createAlert

| 方法名               | 返回        | 说明              |
| -------------------- | ----------- | ----------------- |
| createAlert(options) | Interaction | 用于创建 Dom 弹框 |



| 参数名  | 类型   | 必须 | 默认值 | 说明     |
| ------- | ------ | ---- | ------ | -------- |
| options | Object | true | null   | 配置详情 |

| 属性名    | 类型              | 必须  | 默认值      | 说明                                      |
| --------- | ----------------- | ----- | ----------- | ----------------------------------------- |
| innerHTML | String \| Element | true  | null        | Dom 字符串模板或者 Dom 实例对象           |
| callBack  | Function          | true  | null        | 回调函数,返回{zoom: Number, item: Object} |
| name      | String            | false | createAlert | Interaction 实例的名字                    |
| minZoom   | Number            | false | 18          | 最小可点击级别                            |



```javascript
cluster.createAlert({
    innerHTML: '<div>123</div>',
    callBack: (e) => {console.log(e)},
    name: 'testCreateAlert',
    minZoom: 16
})
```



**注意:** 因为此类是创建聚合,弹框事件最好设置最小级别为创建地图时设置的视图最大级别(maxZoom)
