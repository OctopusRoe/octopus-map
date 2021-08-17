## OCTOPUS-MAP

基于openlayer V6.6.1 为基础,进行二次开发的地图工具包,通过二次封装,简化 openlayer 的开发难度

#### 安装方法

```
npm install octopus-map -S
```

#### 引用

```javascript
import MapInit from 'octopus-map'
```

#### 使用

```javascript
const Tmap = new MapInit({
  target: 'root',
  useControl: false
})
// 添加视图
Tmap.addView({
  center: [115.904642, 28.680854],
  proj: 'EPSG:4326',
  zoom: 15,
  minZoom: 7,
  maxZoom: 18
})
// 添加天地图瓦片资源
Tmap.useTianDiTu({
  type: ['vec', 'cva'],
  proj: 'EPSG:4326',
  key: 'a3f0bbf7db728e8db4ebbe860679d4bb',
  url: 'http://t{0-7}.tianditu.gov.cn/'
})
```