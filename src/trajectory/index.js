/**
 *
 * @description 创建轨迹动画
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

import Feature from 'ol/Feature'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Point, LineString } from 'ol/geom'
import { getVectorContext } from 'ol/render'
import { Style, Icon, Stroke } from 'ol/style'
import { unByKey } from 'ol/Observable'

const PI = 3.1415926535897932384626
const halfPI = PI / 2

/**
 * @description 路径线的样式
 *
 * @typedef {Object} style
 * @property {Number} [strokeWidth] 路径的宽度,默认为5
 * @property {String} [strokeColor] 路径的颜色,与 css 的 color 字段一样,默认为 #000
 * @property {Number[]} [lineDash] 路径的线段样式
 * @property {String} [lineDashColor] 路径的线段颜色
 */

export default class Trajectory {
  /**
   *
   * @param {Object} options
   * @param {import('ol/Map').default} map Map 实例
   * @param {String} options.iconUrl 动画图标的 URL
   * @param {String} [options.name] Layer 实例的名字
   * @param {style} [options.style] 路径的线段样式
   * @param {Number} [options.speed] 动画速度
   * @param {Boolean} [options.repeat] 是否重复
   */
  constructor (options) {
    /** @description 动画默认为关闭 */
    this._animating = false

    /** @description 动画开始时间 */
    this._startTime = null

    /** @description 动画速度源 */
    this._speed = options.speed || 0.1

    /** @description postrender 监听事件的 key */
    this._listenKey = null

    /** @description 用于保存动画的行走分数 */
    this._distance = null

    /** @description  */
    this._index = 0

    /** @description 保存创建实例时, 传入的全部参数 */
    this._options = options

    /** @description 用于储存 Feature 实例的仓库 */
    this._feature = []

    /** @description 用于储存路径的仓库 */
    this._route = null

    /** @description 用于储存已经经过的路径仓库 */
    this._newRoute = []

    /** @description 创建源 */
    this._source = new VectorSource({ wrapX: false })

    /** @description 创建图层 */
    this._layer = new VectorLayer({
      source: this._source,
      style: (feature) => this._returnStyle(feature)
    })

    /** @description 设置 Layer 层名字 */
    this._layer.set('name', options.name || 'trajectory')

    /** @description 创建样式 */
    this._style = this._createStyle(options)
  }

  /** @description 获取轨迹的路径 LineString 对象 */
  get route () {
    return this._route
  }

  /** @description 获取动画的 layer 对象 */
  get layer () {
    return this._layer
  }

  /**
   * @description 创建样式
   *
   * @param {Object} options 实例化类时的参数
   */
  _createStyle (options) {
    // 解构 lineSyle
    const { style } = options

    // 创建路径样式
    const route = new Style({
      stroke: new Stroke({
        width: style && style.strokeWidth || 5,
        color: style && style.strokeColor || 'rgba(255, 255, 255, 1)'
      })
    })

    // 创建 icon 样式
    const geoMarker = new Style({
      image: new Icon({
        src: options.iconUrl
      })
    })

    // 创建已经过路径
    const lineDash = new Style({
      stroke: new Stroke({
        width: style && style.strokeWidth || 5,
        color: style && style.lineDashColor || 'rgba(0, 0, 0 ,1)',
        lineDash: style && style.lineDash || [10, 10]
      })
    })

    return { route, geoMarker, lineDash, startMarker: null, endMarker: null }
  }

  /**
   * @description 返回样式
   *
   * @param {import('ol/Feature').default} feature
   * @return {import('ol/style/Style').default} 返回 Style 实例
   */
  _returnStyle (feature) {
    if (this._animating && feature.get('type') === 'geoMarker') return null
    return this._style[feature.get('type')]
  }

  /**
   * @description 根据传入的参数,返回 Feature 实例
   *
   * @param {String} options type 的类型
   * @return {import('ol/Feature').default} 返回的 Feature 实例
   */
  _searchType (options) {
    let feature
    this._feature.forEach(item => {
      if (item.get('type') === options) {
        feature = item
      }
    })

    return feature
  }

  /**
   * @description 创建路径的
   *
   * @param {String} options Feature 实例的名字
   * @return {Array<import('ol/Feature').default>} 返回由 Feature 实例组成的一个对象组
   */
  _createRoute (options) {
    // 创建 路径的 Feature 实例
    const route = new Feature({
      type: 'route',
      name: options || 'trajectory',
      geometry: this._route
    })

    // 创建标记的 Feature 实例
    const geoMarker = new Feature({
      type: 'geoMarker',
      name: options || 'trajectory',
      geometry: new Point(this._route.getCoordinateAt(0))
    })

    // 创建开始位置的 Feature 实例
    const startMarker = new Feature({
      type: 'startMarker',
      name: options || 'trajectory',
      geometry: new Point(this._route.getCoordinateAt(0))
    })

    // 创建结束位置的 Feature 实例
    const endMarker = new Feature({
      type: 'endMarker',
      name: options || 'trajectory',
      geometry: new Point(this._route.getCoordinateAt(1))
    })
    this._source.addFeatures([route, geoMarker, startMarker, endMarker])
    return [route, geoMarker, startMarker, endMarker]
  }

  /**
   * @description 动画的核心方法, 图标移动的方法
   *
   * @param {Event} event Event 事件
   */
  _animation (event) {
    // 保留一个用于在事件画布上绘图的矢量上下文
    const vectorContext = getVectorContext(event)

    // 获取渲染帧状态
    const frameState = event.frameState

    if (this._animating) {
      // 使用帧状态时间减去当前时间
      const elapsedTime = frameState.time - this._startTime

      // 基础参数
      const baseNumber = 1000
      // 得到一个小数
      const distance = this._distance = (this._speed * elapsedTime) / baseNumber

      if (distance >= 1) {
        // 停止动画
        this._stopAnimation(true, this._options.repeat)
        return
      }
      // 获取现在的坐标
      const newPoint = this._route.getCoordinateAt(distance)

      // 获取路径坐标
      const route = this._route.getCoordinates()

      // 循环判断经过的 index 值
      for (let i = 0; i < route.length; i++) {
        if (i + 1 === route.length) {
          continue
        }
        const array = [route[i], route[i + 1]]
        const routeLineString = new LineString(array)
        if (routeLineString.intersectsCoordinate(newPoint)) {
          this._index = i
        }
      }

      let index

      // 判断 实例中的 _index 是否等于路径数组的 length
      if (this._index === route.length) {
        index = this._index
      } else {
        index = this._index + 1
      }

      // 角度计算
      const rotation = -Math.atan2(newPoint[1] - route[index][1], newPoint[0] - route[index][0]) - halfPI

      // 设置样式角度
      this._style['geoMarker'].getImage().setRotation(rotation)

      // 将从 LineString 中提供的分数处理成为一个点坐标
      const currentPoint = new Point(newPoint)
      // 把行动路径坐标加入仓库

      this._newRoute.push(newPoint)
      // 创建一个新的 LineString 对象
      const lineString = new LineString(this._newRoute)

      // 创建一个 Feature 实例
      const feature = new Feature(currentPoint)
      // 创建一个 Feature 实例
      const lineStringFeature = new Feature(lineString)

      // 吧 Feature 实例渲染进 canvas
      vectorContext.drawFeature(lineStringFeature, this._style['lineDash'])
      // 把 Feature 实例渲染进 canvas
      vectorContext.drawFeature(feature, this._style['geoMarker'])
    }

    // 渲染地图
    this._options.map.render()
  }

  /**
   * @description 私有关闭方法
   *
   * @param {Boolean} options 是否直接到达终点
   * @param {Boolean} repeat 是否重复
   */
  _stopAnimation (options, repeat) {
    const geoMarker = this._searchType('geoMarker')

    this._animating = false

    // 判断是否直接跳到终点
    const distance = options ? 1 : this._distance

    // 从 LineString 获取一个坐标点
    const coord = this._route.getCoordinateAt(distance)

    // 获取geoMarker特征几何，并设置一个新的坐标GIS数组
    geoMarker.getGeometry().setCoordinates(coord)

    // 重置已经过的路径仓库
    this._newRoute = []
    // 停止监听 'postrender' 事件
    unByKey(this._listenKey)

    if (repeat) {
      this.start()
    }
  }

  /**
   * @description 创建轨迹动画
   *
   * @param {Object} options 创建轨迹动画的参数
   * @param {String} options.name Feature 实例的名字
   * @param {Number[][]} options.route 轨迹路径的坐标
   */
  create (options) {
    const { route } = options

    // 创建 LineString 实例
    this._route = new LineString(route)

    // 计算初始化时的角度
    const rotation = -Math.atan2(route[0][1] - route[1][1], route[0][0] - route[1][0]) - halfPI

    // 设置 Icon 角度
    this._style['geoMarker'].getImage().setRotation(rotation)

    // 创建轨迹 Feature, 并放入仓库中
    this._feature = this._createRoute(options.name)

    return { layer: this._layer, feature: this._feature }
  }

  /** @description 开始动画的方法 */
  start () {
    // 设置一个setTimeout 等待 Icon 加载 image
    setTimeout(() => {
      if (this._animating) {
        this._stopAnimation(true)
      } else {
        // 设置 animation
        this._animating = true
        // 设置 _startTime
        this._startTime = new Date().getTime()
        // 监听 'postrender' 事件
        this._listenKey = this._layer.on('postrender', this._animation.bind(this))
        // 渲染地图
        this._options.map.render()
      }
    })
  }

  /** @description 停止动画的方法 */
  stop () {
    this._stopAnimation(false, false)
  }
}
