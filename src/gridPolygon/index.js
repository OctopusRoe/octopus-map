/**
 *
 * @description 创建网格的 layer
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

import BaseFeature from '../baseFeature'
import Feature from 'ol/Feature'
import Polygon from 'ol/geom/Polygon'
import Select from 'ol/interaction/Select'
import { boundingExtent, getCenter } from 'ol/extent'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { click, pointerMove } from 'ol/events/condition'
import { rightMouseDown } from '../events/condition'
import { Style, Fill, Stroke, Text } from 'ol/style'

/**
 * @typedef {Object} createGridOptions 创建网格方法的参数
 * @property {Number[][][]} point 点坐标的数组
 * @property {String} name feature 的名字
 * @property {String} color 网格内的填充颜色, 和css写法一样
 * @property {String} label 网格的标注
 */

export default class GridPolygon extends BaseFeature {
  /**
   * @description 创建网格的实例
   *
   * @param {Object} options
   * @param {String} options.name Layer层的名字
   * @param {Number} [options.opacity] 透明度, 默认为1
   * @param {{color: String, width: Number, lineDash?: Number[]}} options.stroke 网格边框配置
   * @param {String} options.hoverColor 选中时的颜色, 默认为 rbga(0, 255, 0, 0.4)
   * @param {String} options.fontColor 标注字体颜色
   * @param {String} options.fontStyle 标注的字体样式, 和 css 中的 font 字段一样
   * @param {Number} options.minZoomShow 标注的最小显示级别, 默认为 0
   */
  constructor (options) {
    super()

    /** @description 创建源 */
    this._source = new VectorSource({ wrapX: false })

    /** @description 创建图层 */
    this._layer = new VectorLayer({
      opacity: options.opacity ? options.opacity : 1,
      source: this._source,
      style: (feature) => this._returnStyle(feature, false)
    })

    this._layer.set('name', options.name || 'gridPolygon')

    /** @description 保存创建实例时 传入的全部参数 */
    this._options = options

    /** @description 用于储存 feature 实例的仓库 */
    this._feature = []

    /** @description 用于储存 interaction 的 select 实例仓库 */
    this._select = []

    /** @description 标记是否禁止鼠标右键 */
    this._useRight = true
  }

  /**
   * @description 禁止鼠标右键默认事件
   *
   * @param {Event} event event 事件参数
   */
  _prohibitDefaultMouseRightButton (event) {
    event.preventDefault()
  }

  /**
   * @description 创建 Style 实例
   *
   * @param {import('ol/Feature').default} feature feature 实例
   * @param {Boolean} isSelect 是否选中
   */
  _returnStyle (feature, isSelect) {
    let _name = (feature.get('label') || '').toString()

    let _color = feature.get('color') || 'rgba(0, 0, 255, 0.1)'

    if (isSelect && this._options.hoverColor) {
      _color = this._options.hoverColor
    }

    // 设置边框样式
    const stroke = new Stroke({
      // this._options 中有 stroke 配置
      // 判断 stroke 中是否含有 color 并且不为空, 没有使用默认值
      // this._options 没有 stroke 配置, 使用默认值
      color: this._options.stroke ? this._options.stroke.color || 'rgba(0, 0, 255, 0.8)' : 'rgba(0, 0, 255, 0.8)',
      // this._options 中有 stroke 配置
      // 判断 stroke 中是否含有 width 并且不为空, 为空则使用默认值
      // this._options 没有 stroke 配置, 使用默认值
      width: this._options.stroke ? this._options.stroke.width || 0 : 0,
      // this._options 中有 stroke 配置
      // 判断 stroke 中是否含有 lineDash, 不存在则使用默认值
      // this._options 没有 stroke 配置,使用默认值
      lineDash: this._options.stroke ? this._options.stroke.lineDash || [] : []
    })

    // 设置填充样式
    const fill = new Fill({
      color: _color
    })

    // 判断缩放级别是否小于设置的标注最小显示级别
    if (this._options.map.getView().getZoom() < (this._options.minZoomShow || 0)) {
      _name = ''
    }

    // 设置文本样式
    const text = new Text({
      font: this._options.fontStyle || '15px Microsoft YaHei',
      text: _name,
      fill: new Fill({
        color: this._options.fontColor || '#333'
      })
    })

    return new Style({
      stroke,
      fill,
      text
    })
  }

  /** @description 禁止与允许鼠标右键事件 */
  preventDefault () {
    if (this._useRight) {
      this._useRight = false
      document.querySelector('body').addEventListener('contextmenu', this._prohibitDefaultMouseRightButton)
    } else {
      this._useRight = true
      document.querySelector('body').removeEventListener('contextmenu', this._prohibitDefaultMouseRightButton)
    }
  }

  /**
   * @description 创建网格
   *
   * @param {createGridOptions | createGridOptions[]} options
   */
  create (options) {
    if (Array.isArray(options)) {
      const array = options.map(item => {
        return new Feature({
          item: item,
          name: item.name,
          label: item.label,
          color: item.color,
          geometry: new Polygon(item.point)
        })
      })

      this._feature = this._feature.concat(array)
      this._addFeature(array)
    } else {
      const feature = new Feature({
        item: options,
        name: options.name,
        label: options.label,
        color: options.color,
        geometry: new Polygon(options.point)
      })
      this._feature.push(feature)
      this._addFeature(feature)
    }

    return { layer: this._layer, feature: this._feature }
  }

  /**
   * @description 添加选择高亮功能
   *
   * @param {Function} callBack 回调函数
   * @param {String} name interaction 实例的名字,默认为 select
   * @return {import('ol/interaction/Select').default} interaction 实例
   */
  addSelect (callBack, name) {
    this._select.push(
      new Select({
        condition: pointerMove,
        layers: [this._layer],
        style: (feature) => this._returnStyle(feature, true)
      })
    )

    this._select[this._select.length - 1].set('name', name || 'select')

    this._select[this._select.length - 1].on('select', e => {
      if (e.selected.length === 0) return
      callBack && callBack({
        zoom: Math.ceil(this._options.map.getView().getZoom()),
        item: e.selected[e.selected.length - 1].get('item')
      })
    })

    return this._select[this._select.length - 1]
  }

  /**
   * @description 添加鼠标左键事件
   *
   * @param {Function} callBack 回调函数
   * @param {String} name interaction 实例的名字
   * @returns {import('ol/interaction/Select').default} interaction 的实例
   */
  addClick (callBack, name) {
    this._select.push(
      new Select({
        condition: click,
        layers: [this._layer],
        style: (feature) => this._returnStyle(feature, false)
      })
    )

    // 设置 select 的名字
    this._select[this._select.length - 1].set('name', name || 'clickSelect')

    this._select[this._select.length - 1].on('select', e => {
      if (e.selected.length === 0) return
      callBack && callBack({
        zoom: Math.ceil(this._options.map.getView().getZoom()),
        item: e.selected[e.selected.length - 1].get('item')
      })
    })

    return this._select[this._select.length - 1]
  }

  /**
   * @description 添加鼠标右键功能
   *
   * @param {Function} callBack 回调函数
   * @param {String} name interaction 的名字
   * @returns {import('ol/interaction/Select').default} interaction 的实例
   */
  addRightClick (callBack, name) {
    this._select.push(
      new Select({
        condition: rightMouseDown,
        layers: [this._layer],
        style: (feature) => this._returnStyle(feature, false)
      })
    )

    // 设置 select 的名字
    this._select[this._select.length - 1].set('name', name || 'rightClickSelect')

    this._select[this._select.length - 1].on('select', e => {
      if (e.selected.length === 0) return
      callBack && callBack({
        zoom: Math.ceil(this._options.map.getView().getZoom()),
        item: e.selected[e.selected.length - 1].get('item')
      })
    })

    return this._select[this._select.length - 1]
  }

  /**
   * @description 获取 Feature 的中心点
   *
   * @param {import('ol/Feature').default} options 传入的 Feature 实例
   * @return {Number[]} 返回一个经纬度数组
   */
  getCenterCoordinates (options) {
    const extent = boundingExtent(options.getGeometry().getCoordinates()[0])
    const center = getCenter(extent)

    return center
  }
}
