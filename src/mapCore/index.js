/**
 *
 * @description ol-map 的核心文件
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

import Map from 'ol/Map'
import View from 'ol/View'
import { getWidth, applyTransform } from 'ol/extent'
import { defaults as InteractionDefaults } from 'ol/interaction'
import { defaults } from 'ol/control'
import { get } from 'ol/proj'
import { unByKey } from 'ol/Observable'
import useTianDiTu from '../useTianditu'
import useWMTS from '../useWMTS'
import tranForm from '../tranform'
import Text from '../text'
import GridPolygon from '../gridPolygon'
import IconMarker from '../marker/iconMarker'
import DomMarker from '../marker/domMarker'
import Trajectory from '../trajectory'
import HeatMap from '../heatMap'
import DrawLine from '../drawLine'
import DrawModify from '../drawModify'
import ClusterPoint from '../clusterPoint'

/**
 * @description
 */

/**
 *
 * @typedef UseControl
 * @property {Boolean} [zoom] zoom 控件
 * @property {Boolean} [rotate] rotate 控件
 * @property {Boolean} [attribution] attribution 控件
 */

/**
 * @description 路径线的样式
 *
 * @typedef {Object} style
 * @property {Number} [strokeWidth] 路径的宽度,默认为5
 * @property {String} [strokeColor] 路径的颜色,与 css 的 color 字段一样,默认为 #000
 * @property {Number[]} [lineDash] 路径的线段样式
 * @property {String} [lineDashColor] 路径的线段颜色
 */

/**
 * @typedef style
 * @property {Number} [radius] 坐标点直径
 * @property {Number} [width] 路径宽度
 * @property {String} [color] 颜色,同 css 的 color 字段
 */

/**
 * @typedef drawStyle
 * @property {Number} [radius] 坐标点直径
 * @property {Number} [width] 路径宽度
 * @property {String} [color] 颜色,同 css 的 color 字段
 */

export class MapInit {
  /**
   * @description MapInit 的构造函数
   *
   * @param {String} options.target 用于渲染地图的 dom 标签
   * @param {Boolean | UseControl} [options.useControl] 用于判断是否使用地图自带控制功能,默认参数为 false
   * @param {Boolean} [doubleClickZoom] 双击放大地图,默认为关闭
   */
  constructor (options) {
    /** @description 提供坐标点转化的方法对象 */
    this.tranForm = tranForm

    /** @description 保存地图服务的仓库 */
    this._mapLayer = []

    /** @description 保存地图图层的仓库 */
    this._layers = []

    /** @description 保存视图层的仓库 */
    this._view = null

    /** @description 保存地图控制图层的仓库 */
    this._interactions = []

    /** @description 保存Overlay的仓库 */
    this._overlays = []

    /** @description openlayer 的 Map 实例 */
    this._map = this._init({ target: options.target, useControl: options.useControl || false })

    /** @description 储存鼠标 whell 事件的key */
    this._wheel = []
  }

  /** @returns 返回 map 的实例 */
  get map () {
    return this._map
  }

  /** @description 返回全部的 layer */
  get layers () {
    return this._layers.concat()
  }

  /** @description 返回全部的 interaction */
  get interactions () {
    return this._interactions.concat()
  }

  /** @description 返回全部的 overlay */
  get overlays () {
    return this._overlays.concat()
  }

  /**
   * @description 创建 Text 实例
   *
   * @param {Object} options
   * @param {String} options.name layer 图层的名字
   * @param {String} options.fontStyle 标注字体样式, 和 css 中的 font 字段一样
   * @param {Number[]} options.offSet 标注字体的偏移量
   * @param {String} options.color 标注字体的颜色
   * @param {{color: String}} options.condition 使用状态的配置
   * @param {{color: String, url?: String}} options.background 默认不填 标注的背景颜色或者图案
   * @param {{color: String, url?: String}} options.condition 默认不填 点击或者选择时的标注背景颜色或图案
   */
  Text (options) {
    return new Text({ ...options, map: this._map })
  }

  /**
   * @description 创建网格的实例
   *
   * @param {Object} options
   * @param {String} options.name layer 层的名字
   * @param {{color: String, width: Number, lineDash?: Number[]}} options.stroke 网格边框配置
   * @param {String} options.hoverColor 选中时的颜色, 默认为 rbga(0, 255, 0, 0.4)
   * @param {String} options.fontColor 标注字体颜色
   * @param {String} options.fontStyle 标注的字体样式, 和 css 中的 font 字段一样
   * @param {Number} options.minZoomShow 标注的最小显示级别, 默认为 0
   */
  GridPolygon (options) {
    return new GridPolygon({ ...options, map: this._map })
  }

  /**
   * @description 创建 icon 点的类
   *
   * @param {Object} options
   * @param {import('ol/map').default} options.map openlayers 的 map 实例
   * @param {String} options.iconUrl 点的 icon url
   * @param {Number[]} options.offset 标注字体的偏移量
   * @param {String} options.fontStyle 标注字体的样式, 和 css 中的 font 字段一样
   * @param {String} options.fontColor 标注字体的颜色
   */
  IconMarker (options) {
    return new IconMarker({ ...options, map: this._map })
  }

  /**
   * @description 创建 dom 点的类
   *
   * @param {Object} options
   * @param {import('ol/map').default} options.map openlayers 的 Map 实例
   * @param {Array<import('ol/Overlay').default>} options.overlay Overlay 实例的数组
   * @param {Number[]} options.offset overlay 整体偏移量
   * @param {String} options.innerHTML overlay dom 字符串模板
   * @param {Boolean} options.useTitle 是否使用 dom 标签的 title 属性
   */
  DomMarker (options) {
    return new DomMarker({ ...options, map: this._map, overlay: this._overlays })
  }

  /**
   * @description 创建轨迹动画
   *
   * @param {Object} options
   * @param {String} options.iconUrl 动画图标的 URL
   * @param {String} [options.name] Layer 实例的名字
   * @param {style} [options.style] 路径的线段样式
   * @param {Number} [options.speed] 动画速度
   * @param {Boolean} [options.repeat] 是否重复
   */
  Trajectory (options) {
    return new Trajectory({ ...options, map: this._map })
  }

  /**
   * @description 创建热力地图
   *
   * @param {Object} options
   * @param {String} [options.name] 热力图层的名字
   * @param {Number} [options.blur] 模糊尺寸
   * @param {Number} [options.radius] 热点半径
   */
  HeatMap (options) {
    return new HeatMap({ ...options, map: this._map })
  }

  /**
   *
   * @param {Object} options
   * @param {import('ol/map').default} options.map Map 实例
   * @param {String} [options.name] Layer 层和 Draw 层的名字
   * @param {drawStyle} [options.style] 样式配置
   * @param {String} [options.iconUrl] 节点图标
   * @param {'LineString' | 'Polygon'} options.type 需要画图的类型
   */
  DrawLine (options) {
    return new DrawLine({ ...options, map: this._map })
  }

  /**
   *
   * @param {Object} options
   * @param {String} [options.name]
   * @param {style} [options.style] 样式配置
   * @param {String} [options.iconUrl] 节点图标
   */
  DrawModify (options) {
    return new DrawModify({ ...options, map: this._map })
  }

  /**
   *
   * @param {Object} options
   * @param {String} options.iconUrl 聚合的图标样式
   * @param {String} [options.fontStyle] 标注字体的样式, 和 css 中的 font 字段一样
   * @param {String} [options.fontColor] 标注字体的颜色
   * @param {Number[]} [options.offset] 标注字体的偏移量[x, y]
   * @param {Number} [options.distance] 要素将聚集在一起的距离
   */
  ClusterPoint (options) {
    return new ClusterPoint({ ...options, map: this._map })
  }

  /**
   * @description MapInit 类的私有方法,用于创建 Map 对象的实例
   *
   * @param {Object} options
   * @param {String} options.target 用于渲染地图的 dom 标签
   * @param {Boolean | UseControl} [options.useControl] 用于判断是否使用地图自带控制功能,默认参数为 false
   * @param {Boolean} [doubleClickZoom] 双击放大地图,默认为关闭
   * @return {import('ol/Map').default} 返回一个 Map 对象实例
   */
  _init (options) {
    const { doubleClickZoom = false } = options

    let zoom, rotate, attribution
    if (typeof options.useControl === 'object' && Object.keys(options.useControl).length !== 0 || options.useControl) {
      zoom = options.useControl.zoom
      rotate = options.useControl.rotate
      attribution = options.useControl.attribution
    } else {
      zoom = rotate = attribution = false
    }

    // 关闭双击左键放大地图
    const interactionDefaults = new InteractionDefaults({
      doubleClickZoom: doubleClickZoom
    })

    const map = new Map({
      target: options.target,
      controls: defaults({
        zoom: zoom,
        rotate: rotate,
        attribution: attribution
      }),
      interactions: interactionDefaults
    })

    return map
  }

  /**
   * @description 用于添加视图层
   *
   * @param {Object} options
   * @param {String} [options.proj] 视图层的投影坐标系
   * @param {Number[]} [options.center] 视图层的中心点
   * @param {Number} [options.zoom] 视图层的默认放大级别
   * @param {Number} [options.minZoom] 视图层的最小缩放级别
   * @param {Number} [options.maxZoom] 视图层的最大缩放级别
   */
  addView (options) {
    const { maxZoom = 18, proj = 'EPSG:3857' } = options

    const projection = get(proj)
    const projectionExtent = projection.getExtent()
    const width = projectionExtent ? getWidth(projectionExtent) : getWidth(applyTransform([-180.0, -90.0, 180.0, 90.0], fromLonLat))
    const resolutions = []

    for (let z = 1; z < maxZoom + 1; z++) {
      resolutions[z] = width / (256 * Math.pow(2, z))
    }

    this._view = new View({
      projection: projection,
      center: options.center || [0, 0],
      zoom: options.zoom || 0,
      minZoom: options.minZoom || 0,
      maxZoom: maxZoom,
      resolutions: resolutions
    })

    /** @description 添加视图层至 this._map 实例 */
    this._map.setView(this._view)
  }

  /** @description 清除 this._map 中的 map layer */
  removeMap () {
    this._mapLayer.forEach(item => {
      this._map.removeLayer(item)
    })
    this._mapLayer = []
  }

  /**
   * @description 添加 layer 到 map 实例上
   *
   * @param {import('ol/layer/Layer').default | Array<import('ol/layer/Layer').default>} options layer 实例或者 layer实例组成的数组
   */
  addLayer (options) {
    if (Array.isArray(options)) {
      options.forEach(item => {
        this.addLayer(item)
      })
    } else {
      this._layers.push(options)
      this._map.addLayer(options)
    }
  }

  /**
   * @description 根据传入的参数返回查询到的 layer
   *
   * @param {String} options layer 的名字
   * @return {import('ol/layer/Layer').default} 返回查询到的 layer
   */
  searchLayer (options) {
    let i, layer
    this._layers.forEach((item, index) => {
      if (item.get('name') === options) {
        layer = item
        i = index
      }
    })

    return { layer: layer, index: i, ol_uid: layer && layer.ol_uid }
  }

  /**
   * @description 根据传入大参数返回查询到的 layer 实例数组
   *
   * @param {String | String[]} options layer 的名字或名字数组
   * @returns {Array<import('ol/layer/Vector').default>} layer 实例所组成的数组
   */
  searchLayers (options) {
    const layerArray = []
    if (Array.isArray(options)) {
      options.forEach(item => {
        const layers = this.searchLayers(item)
        layerArray.push(...layers)
      })
    } else {
      this._layers.forEach(item => {
        if (item.get('name') === options) {
          layerArray.push(item)
        }
      })
    }

    return layerArray
  }

  /**
   * @description 从 map 上移除 layer
   *
   * @param {import('ol/layer/Layer').default | Array<import('ol/layer/Layer').default>} options layer 实例或者 layer实例组成的数组
   */
  removeLayer (options) {
    if (Array.isArray(options)) {
      options.forEach(item => {
        this.removeLayer(item)
      })
    } else {
      const { index: index } = this.searchLayer(options.get('name'))
      if (index === undefined) return
      this._layers.splice(index, 1)
      this._map.removeLayer(options)
    }
  }

  /**
   * @description 添加 overlay 到 map 实例上
   *
   * @param {import('ol/Overlay').default | Array<import('ol/Overlay').default>} options
   */
  addOverlay (options) {
    if (Array.isArray(options)) {
      options.forEach(item => {
        this.addOverlay(item)
      })
    } else {
      this._overlays.push(options)
      this._map.addOverlay(options)
    }
  }

  /**
   * @description 根据传入的参数返回查询到的 Overlay 实例
   *
   * @param {String} options Overlay 的名字
   * @return {{overlay: import('ol/Overlay').default, index: Number}} 返回查询到的数据
   */
  searchOverlay (options) {
    let overlay, i
    this._overlays.forEach((item, index) => {
      if (item.get('name') === options) {
        overlay = item
        i = index
      }
    })

    return { overlay: overlay, index: i }
  }

  /**
   * @description 根据传入的参数返回查询到的 Overlay 实例数组
   *
   * @param {String | String[]} options Overlay 的名字或名字数组
   * @return {Array<import('ol/Overlay').default>} Overlay 所组成的数组
   */
  searchOverlays (options) {
    const overlayArray = []
    if (Array.isArray(options)) {
      options.forEach(item => {
        const overlay = this.searchOverlays(item)
        overlayArray.push(...overlay)
      })
    } else {
      this._overlays.forEach(item => {
        if (item.get('name') === options) {
          overlayArray.push(item)
        }
      })
    }

    return overlayArray
  }

  /**
   * @description 移除全部的 Overlay 实例
   */
  removeOverlay (options) {
    if (Array.isArray(options)) {
      options.forEach(item => {
        this.removeOverlay(item)
      })
    } else {
      const { index: index } = this.searchOverlay(options.get('name'))
      if (index === undefined) return
      this._overlays.splice(index, 1)
      this._map.removeOverlay(options)
    }
  }

  /**
   * @description 添加 interaction 到 map 实例上
   *
   * @param {import('ol/interaction/Interaction').default | import('ol/interaction/Interaction').default[]} options interaction 实例或者 interaction实例组成的数组
   */
  addInteraction (options) {
    if (Array.isArray(options)) {
      options.forEach(item => {
        this.addInteraction(item)
      })
    } else {
      this._interactions.push(options)
      this._map.addInteraction(options)
    }
  }

  /**
   * @description 根据传入的参数返回查询到的 interaction
   *
   * @param {String} options interaction 的名字
   * @return {import('ol/interaction/Interaction').default} 返回查询到的 interaction
   */
  searchInteraction (options) {
    let i, interaction
    this._interactions.forEach((item, index) => {
      if (item.get('name') === options) {
        interaction = item
        i = index
      }
    })

    return { interaction: interaction, index: i, ol_uid: interaction && interaction.ol_uid }
  }

  /**
   * @description 根据传入的参数返回查询到的 interaction 实例数组
   *
   * @param {String | String[]} options interaction 的名字或者名字数组
   * @return {Array<import('ol/interaction/Interaction').default>} interaction 所组成的数组
   */
  searchInteractions (options) {
    const interactionArray = []
    if (Array.isArray(options)) {
      options.forEach(item => {
        const interaction = this.searchInteractions(item)
        interactionArray.push(...interaction)
      })
    } else {
      this._interactions.forEach(item => {
        if (item.get('name') === options) {
          interactionArray.push(item)
        }
      })
    }

    return interactionArray
  }

  /**
   * @description 从 map 上移除 interaction
   *
   * @param {import('ol/interaction/Interaction').default | Array<import('ol/interaction/Interaction').default>} options interaction 实例或者 interaction实例组成的数组
   */
  removeInteraction (options) {
    if (Array.isArray(options)) {
      options.forEach(item => {
        this.removeInteraction(item)
      })
    } else {
      const { index: index } = this.searchInteraction(options.get('name'))
      if (index === undefined) return
      this._interactions.splice(index, 1)
      this._map.removeInteraction(options)
    }
  }

  /**
   * @description 创建使用天地图的 layer, 并添加进 map 实例
   *
   * @param {Object} options
   * @param {String[]} options.type 天地图提供的数据图层数组
   * @param {String} options.proj 投影坐标系类型
   * @param {String} options.key 开发者秘钥
   * @param {String} options.url 天地图瓦片基础url
   */
  useTianDiTu (options) {
    /** @description 循环创建 layer 实例 */
    this._mapLayer = options.type.map(item => {
      return useTianDiTu({
        type: item,
        proj: options.proj,
        key: options.key,
        url: options.url
      })
    })
    /** @description 添加地图 layer 实例进 map 实例 */
    this._mapLayer.forEach(item => {
      this._map.addLayer(item)
    })
  }

  /**
   * @description 创建使用 WMTS 服务的 layer, 并添加进 map 实例
   *
   * @param {Object} options
   * @param {String} options.type WMTS服务提供的图层样式
   * @param {String} options.proj WMTS服务提供的投影坐标系类型
   * @param {String} options.matrixSet 非必填,矩阵集
   * @param {String} options.format 非必填,图像格式
   * @param {String} options.key 非必填,开发者秘钥
   * @param {Number} [options.maxZoom] 非必填,地图最大层级
   * @param {String} options.url 必填,WMTS服务的基础url
   */
  useWMTS (options) {
    this._mapLayer.push(useWMTS({
      type: options.type,
      proj: options.proj || 'EPSG:3857',
      matrixSet: options.matrixSet,
      format: options.format,
      key: options.key || '',
      url: options.url,
      maxZoom: options.maxZoom
    }))
    /** @description 添加地图 layer 实例进 map 实例 */
    this._mapLayer.forEach(item => {
      this._map.addLayer(item)
    })
  }

  /** @param {Number[]} options 设置视图中心点,接受参数 [lng, lat] */
  setCenter (options) {
    this._view.setCenter(options)
  }

  /** @param {Number} options 设置缩放级别 */
  setZoom (options) {
    this._view.setZoom(options)
  }

  /** @description 当滚轮滚动时触发 */
  zoomChange (fun) {
    const key = this._map.on('wheel', (e) => {
      fun(this.getZoom(), e)
    })

    return key
  }

  /**
   * @param {Object} event 鼠标点击的 event 事件
   * @return {Number[]} 鼠标点击位置的经纬度
   */
  getLonLat (event) {
    if (event.originalEvent) {
      return this._map.getEventCoordinate(event.originalEvent)
    } else {
      return this._map.getEventCoordinate(event)
    }
  }

  /** @return {Number} 返回缩放级别 */
  getZoom () {
    return Math.ceil(this._view.getZoom())
  }

  /**
   * @description 注册事件的方法
   *
   * @param {String | Array<String>} eventName 需要注册的事件类型
   * @param {Function} callBack 回调函数
   * @return {import('ol/events').EventsKey | Array<import('ol/events').EventsKey>}
   */
  on (eventName, callBack) {
    const key = this._map.on(eventName, (e) => {
      e.zoom = Math.ceil(this._view.getZoom())
      callBack(e)
    })
    return key
  }

  /**
   * @description 解除注册事件的方法
   *
   * @param {import('ol/events').EventsKey | Array<import('ol/events').EventsKey>} key
   */
  unon (key) {
    unByKey(key)
  }

  /**
   * @description 从传入的参数中获取坐标信息
   *
   * @param {import('ol/Feature').default | Array<import('ol/Feature').default>} options feature 实例或者实例数组
   * @return {Number[] | Number[][]} coordinate 数组
   */
  getCoordinateFromFeature (options) {
    let coordinates = []
    if (Array.isArray(options)) {
      options.forEach(item => {
        coordinates.push(
          item.getGeometry().getCoordinates()
        )
      })
    } else {
      coordinates = options.getGeometry().getCoordinates()
    }

    return coordinates
  }

  /**
   * @description 清除实例仓库中的全部数据
   */
  clear () {
    if (this.layers.length !== 0) {
      this.removeLayer(this.layers)
    }
    if (this.overlays.length !== 0) {
      this.removeOverlay(this.overlays)
    }
    if (this.interactions.length !== 0) {
      this.removeInteraction(this.interactions)
    }
  }

  render () {
    this._map.render()
  }
}

export default MapInit
