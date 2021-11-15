/**
 * @description 渲染线段
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 */

import Feature from 'ol/Feature'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { LineString } from 'ol/geom'
import { Style, Stroke } from 'ol/style'

/**
 * @description 线段样式
 *
 * @typedef {Object} style
 * @property {Number} [width] 线段宽度
 * @property {String} [color] 路径的颜色,与 css 的 color 字段一样,默认为 #000
 */

export default class Line {
  /**
   *
   * @param {Object} options
   * @param {import('ol/Map').default} options.map Map 实例
   * @param {String} options.name Layer 实例的名字
   * @param {style} options.style 路径的样式
   */
  constructor(options) {
    this._map = options.map
    /** @description 保存创建实例时, 传入的全部参数 */
    this._options = options
    /** @description 用于储存 Feature 实例的仓库 */
    this._feature = []
    /** @description 用于储存路径的仓库 */
    this._route = []
    /** @description 创建源 */
    this._source = new VectorSource({ wrapX: false })
    /** @description 创建图层 */
    this._layer = new VectorLayer({
      source: this._source,
      style: () => this._createStyle(options)
    })

    /** @description 设置 Layer 层名字 */
    this._layer.set('name', options.name || 'line')
  }

  /** @description 获取 layer 对象 */
  get layer () {
    return this._layer
  }

  /** 获取 lineString 对象 */
  get route () {
    return this._route
  }

  _createStyle (options) {
    const { style } = options

    const styles = new Style({
      stroke: new Stroke({
        width: style && style.width || 5,
        color: style && style.color || 'rgba(255, 255, 255, 1)'
      })
    })

    return styles
  }

  /**
   *
   * @param {Object} options
   * @param {String} [options.name] feature 的名字
   * @param {Number[][]} options.point 线段的经纬度
   */
  _createLine (options) {
    const line = new Feature({
      type: 'line',
      name: options.name || 'line',
      geometry: new LineString(options.point)
    })

    this._source.addFeature(line)
    this._feature.push(line)
  }

  /**
   * @description 创建线段的方法
   * @param {{name: String, point: Number[]} || {name: String, point: Nymber[]}[]} options
   */
  create (options) {
    if (Array.isArray(options)) {
      options.forEach(item => {
        this._createLine(item)
      })
    } else {
      this._createLine(options)
    }

    return { layer: this._layer, feature: this._feature }
  }

  addWheel () {
    const key = this._map.on('wheel', (e) => {
      const options = this._options
      const { originalEvent } = e
      if (originalEvent.wheelDeltaY > 0) {
        options.style.width = options.style.width > 16 ? options.style.width : options.style.width + 2
        this._layer.setStyle(this._createStyle(options))
      } else {
        options.style.width = options.style.width < 5 ? options.style.width : options.style.width - 2
        this._layer.setStyle(this._createStyle(options))
      }
    })

    return key
  }
}
