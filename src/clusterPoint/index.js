/**
 *
 * @description 聚合
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Select from 'ol/interaction/Select'
import BaseFeature from '../baseFeature'
import DomMarker from '../marker/domMarker'
import { click } from 'ol/events/condition'
import { Cluster, Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { Style, Text, Icon, Fill } from 'ol/style'

export default class ClusterPoint extends BaseFeature {
  /**
   *
   * @param {Object} options
   * @param {String} options.iconUrl 聚合的图标样式
   * @param {String} options.name Layer 层名字
   * @param {String} [options.fontStyle] 标注字体的样式, 和 css 中的 font 字段一样
   * @param {String} [options.fontColor] 标注字体的颜色
   * @param {Number[]} [options.offset] 标注字体的偏移量[x, y]
   * @param {Number} [options.distance] 要素将聚集在一起的距离
   */
  constructor (options) {
    super()
    /** @description 保存粗昂见实例时, 传入的全部参数 */
    this._options = options

    /** @description 用于储存 feature 实例仓库 */
    this._feature = []

    /** @description 用于储存 interaction 实例仓库 */
    this._select = []

    /** @description 样式仓库 */
    this._styleCache = {}

    /** @description 创建源 */
    this._source = new VectorSource({ wrapX: false })

    /** @description 用于储存 Overlay 实例 */
    this._overlay = null

    /** @description 用于储存 DomMarker 实例 */
    this._domMarker = null

    /** @description 创建集合源 */
    this._cluster = new Cluster({
      distance: options.distance || 50,
      source: this._source
    })

    /** @description 创建图层 */
    this._layer = new VectorLayer({
      source: this._cluster,
      style: (feature) => this._returenStyle(feature)
    })

    this._layer.set('name', options.name || 'clusterPoint')
  }

  /**
   * @return {import('ol/interaction/Interaction').default} Interaction 实例
   */
  _createSelect () {
    this._select.push(
      new Select({
        condition: click,
        layers: [this._layer],
        style: (feature) => this._returenStyle(feature)
      })
    )

    return this._select[this._select.length - 1]
  }

  /**
   * @description 创建 Element 实例
   *
   * @param {String | Element} element Dom 字符串模板或者 Dom 实例
   * @return {Element} 返回 Dom 实例
   */
  _createElement (element) {
    let div
    if (element instanceof Element) {
      div = element
    } else {
      div = document.createElement('div')
      div.insertAdjacentHTML('afterbegin', element)
    }

    return div
  }

  /**
   * @description 返回 Style 实例
   *
   * @param {import('ol/Feature').default} feature feature 实例
   * @return {import('ol/style/Style').default} Style 实例
   */
  _returenStyle (feature) {
    const size = feature.get('features').length

    let style = this._styleCache[size]

    if (!style) {
      style = new Style({
        image: new Icon({
          src: this._options.iconUrl
        }),
        text: new Text({
          font: this._options.fontStyle || '15px Microsoft YaHei',
          text: size.toString(),
          fill: new Fill({
            color: this._options.fontColor || 'rgba(255, 255, 255, 1)'
          }),
          offsetX: this._options.offset ? this._options.offset[0] : 0,
          offsetY: this._options.offset ? this._options.offset[1] : 0
        })
      })

      this._styleCache[size] = style
    }

    return style
  }

  /**
   * @description 创建聚合
   *
   * @param {Array<{point: Number[], id: String}> | {point: Number[], id: String}} options 数据对象或者数据数组
   * @return {{layer: import('ol/layer/Vector').default, feature: Array<import('ol/Feature').default>}}
   */
  create (options) {
    if (Array.isArray(options)) {
      const array = options.map(item => (
        new Feature({
          item: item,
          id: item.id,
          geometry: new Point(item.point)
        })
      ))

      this._feature.concat(array)
      this._addFeature(array)
    } else {
      const feature = new Feature({
        item: options,
        id: options.id,
        geometry: new Point(options.point)
      })

      this._feature.push(feature)
      this._addFeature(feature)
    }

    return { layer: this._layer, feature: this._feature }
  }

  /**
   * @description 通过 MapBrowserEvent 中获取鼠标事件
   *
   * @param {import('ol/MapBrowserEvent').default | Event} e
   * @returns {{zoom: Number, delta: Number, event: import('ol/MapBrowserEvent').default | Event}}
   */
  wheel (e) {
    const { originalEvent } = e
    let delta
    if (originalEvent) {
      delta = originalEvent.delta || originalEvent.wheelDelta
    } else {
      delta = e.delta || e.wheelDelta
    }

    return { zoom: e.zoom || Math.ceil(this._options.map.getView().getZoom()), delta: delta, event: e }
  }

  /**
   * @description 点击事件
   *
   * @param {String} name Interaction 实例名字
   * @param {Function} callBack 回调函数
   */
  addClick (name, callBack, minZoom) {
    const select = this._createSelect()

    select.set('name', name || 'clusterPointClick')

    select.on('select', e => {
      // 判断是否是最后一级
      if (Math.ceil(this._options.map.getView().getZoom()) < 18) {
        // 设置放大一级
        this._options.map.getView().setZoom(Math.ceil(this._options.map.getView().getZoom()) + 1)
        // 设置放大中心点
        if (e.selected[0]) {
          this._options.map.getView().setCenter(e.selected[0].get('geometry').getCoordinates())
        }
      }
      if (this._options.map.getView().getZoom() < (minZoom || 18)) return
      if (e.selected.length === 0) return
      if (e.selected[0].get('features').length > 1) return
      callBack && callBack({
        zoom: Math.ceil(this._options.map.getView().getZoom()),
        item: e.selected[0].get('features')[0].get('item')
      })
    })

    return select
  }

  /**
   * @description 创建 Dom 弹框
   *
   * @param {Object} options
   * @param {String | Element} options.innerHTML Dom 字符串模板或者 Dom 实例
   * @param {Function} options.callBack 回调函数
   * @param {String} [options.name] Interaction 层的名字
   * @param {Number} [options.minZoom] 允许弹窗的最小层级
   */
  createAlert (options) {
    const { innerHTML, callBack, minZoom = 18, offset = [0, 0] } = options

    // 创建 dom 容器
    const div = this._createElement(innerHTML)
    // 设置样式
    div.style.display = 'none'

    const select = this._createSelect()
    select.set('name', options.name || 'createAlert')

    this._domMarker = new DomMarker({
      map: this._options.map,
      overlay: [],
      offset: offset,
      innerHTML: innerHTML,
      useTitle: false
    })

    select.on('select', e => {
      // 小于 minZoom 则不运行
      if (this._options.map.getView().getZoom() < minZoom) return
      // 未选中 Feature 不运行
      if (e.selected.length === 0) return
      // this._overlay 仓库存在则从 map 实例上移除 overlay
      if (this._overlay) {
        this._options.map.removeOverlay(this._overlay)
        this._overlay = null
      }

      div.style.display = 'block'

      callBack && callBack({
        zoom: Math.ceil(this._options.map.getView().getZoom()),
        item: e.selected[0].get('features')[0].get('item')
      })

      const overlay = this._domMarker.create({
        name: 'domeAlert',
        id: e.selected[0].get('features')[0].get('id'),
        point: e.selected[0].getGeometry().getCoordinates()
      })

      this._overlay = overlay.overlay[overlay.overlay.length - 1]
      this._options.map.addOverlay(this._overlay)
    })

    return select
  }
}
