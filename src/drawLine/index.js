/**
 *
 * @description 在地图上画线
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

import LineString from 'ol/geom/LineString'
import Pointer from 'ol/interaction/Pointer'
import Point from 'ol/geom/Point'
import Select from 'ol/interaction/Select'
import { doubleClick } from 'ol/events/condition'
import { Draw } from 'ol/interaction'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style, Stroke, Circle, Fill, Icon } from 'ol/style'

/**
 * @typedef style
 * @property {Number} [radius] 坐标点直径
 * @property {{width: Number, color: String}} [stroke] 坐标点外边框
 * @property {Number} [width] 路径宽度
 * @property {String} [color] 颜色,同 css 的 color 字段
 */

export default class DrawLine {
  /**
   *
   * @param {Object} options
   * @param {import('ol/map').default} options.map Map 实例
   * @param {String} [options.name] Layer 层和 Draw 层的名字
   * @param {style} [options.style] 样式配置
   * @param {String} [options.iconUrl] 节点图标
   * @param {'LineString' | 'Polygon'} options.type 需要画图的类型
   */
  constructor (options) {
    /** @description 保存创建实例时, 传入的全部参数 */
    this._options = options

    /** @description 用于储存 interaction 的实例仓库 */
    this._select = []

    /** @description 创建样式 */
    this._style = this._createStyle(options)

    /** @description 创建源 */
    this._source = new VectorSource({ wrapX: false })

    /** @description 创建图层 */
    this._layer = new VectorLayer({
      source: this._source,
      style: (feature) => this._returnStyle(feature)
    })

    this._layer.set('name', options.name || 'drawLine')

    /** @description 创建动画层 */
    this._drawLayer = this._createDraw(options)
  }

  /** @description 返回 _select 仓库中的所有 interaction 实例 */
  get interactions () {
    return this._select
  }

  /** @description 返回 layer 实例 */
  get layer () {
    return this._layer
  }

  /** @description 返回 draw Interaction 实例 */
  get drawLayer () {
    return this._drawLayer
  }

  /**
   * @description 创建 Draw 的 interaction 实例
   *
   * @param {Object} options 创建实例时传入的参数
   * @return {import('ol/interaction/Draw').default} 返回 Draw 实例
   */
  _createDraw (options) {
    // 添加进 _select 仓库
    this._select.push(
      new Draw({
        source: this._source,
        type: options.type || 'LineString',
        style: this._createStyle(options)
      })
    )

    // 设置 interaction 实例名字
    this._select[this._select.length - 1].set('name', options.name || 'drawLine')
    // 返回 Draw 实例
    return this._select[this._select.length - 1]
  }

  /**
   * @description 创建样式
   *
   * @param {Object} options 创建实例时传入的参数
   */
  _createStyle (options) {
    const { style = {}} = options
    const { stroke } = style

    const image = options.iconUrl
      ? new Icon({
        src: options.iconUrl
      })
      : new Circle({
        radius: style && style.radius || 6,
        stroke: stroke && new Stroke({
          width: stroke.width || 2,
          color: stroke.color || 'rgba(255, 255, 255, 1)'
        }),
        fill: new Fill({
          color: style && style.color || 'rgba(0, 0, 255, 0.5)'
        })
      })

    return new Style({
      geometry: (feature) => {
        return feature.getGeometry()
      },
      stroke: new Stroke({
        color: style && style.color || 'rgba(0, 0, 255, 0.5)',
        width: style && style.width || 6
      }),
      image: image
    })
  }

  /**
   * @description 返回样式
   *
   * @param {import('ol/Feature').default} feature
   */
  _returnStyle (feature) {
    const { style = {}} = this._options
    const { stroke } = style
    const styles = [this._style]

    const image = this._options.iconUrl
      ? new Icon({
        src: this._options.iconUrl
      })
      : new Circle({
        radius: style && style.radius || 6,
        stroke: stroke && new Stroke({
          width: stroke.width || 2,
          color: stroke.color || 'rgba(255, 255, 255, 1)'
        }),
        fill: new Fill({
          color: style && style.color || 'rgba(0, 0, 255, 0.5)'
        })
      })

    let coordinates = null
    if (feature.getGeometry() instanceof LineString) {
      // Geometry 实例如果是 LineString 的子类型
      coordinates = feature.getGeometry().getCoordinates()
    } else {
      coordinates = feature.getGeometry().getCoordinates()[0]
    }
    if (coordinates) {
      coordinates.forEach(item => {
        styles.push(
          new Style({
            geometry: new Point(item),
            image: image
          })
        )
      })
    }
    return styles
  }

  /** @description 清除 _source 中的 Feature */
  _resetDraw () {
    this._source.clear()
  }

  /**
   * @description 判断是否点击鼠标右键,点击右键删除最后添加的坐标点
   *
   * @param {import('ol/MapBrowserEvent').default} mapBrowserEvent Map browser event
   *
   * @return {Boolean} 鼠标右键事件返回 true
   */
  _rightMouseDown (mapBrowserEvent) {
    const { originalEvent } = mapBrowserEvent

    if (originalEvent.button === 2) {
      // 如果点击的是鼠标右键,则移除最后画的一个点
      this._drawLayer.removeLastPoint()
    }
    return originalEvent.button === 2
  }

  /** @description 暴露到外部的开始方法, 返回 Layer 和 interaction */
  create () {
    // 重置画板
    this._resetDraw()
    return { layer: this._layer, interaction: this._drawLayer }
  }

  /** @description 获取图形的点位置 */
  getValue () {
    return this._source.getFeatures()[0].getGeometry().getCoordinates()
  }

  /**
   * @description 移除最后一个点
   *
   * @param {String} [name] interaction 层名字
   * @returns {import('ol/interaction/Interaction').default} 返回 interaction 层
   */
  rmLastPoint (name) {
    // 加入 _select 仓库
    this._select.push(
      new Pointer({
        handleDownEvent: this._rightMouseDown.bind(this)
      })
    )

    // 设置名称
    this._select[this._select.length - 1].set('name', name || 'rightClick')

    // 返回 interaction
    return this._select[this._select.length - 1]
  }

  /**
   * @description 双击鼠标左键结束画图
   *
   * @param {String} name interaction 层名字
   * @param {Function} callBack 回调函数
   * @returns {import('ol/interaction/Interaction').default} 返回 interaction 层
   */
  stopDraw (name, callBack) {
    // 加入 _select 仓库
    this._select.push(
      new Select({
        condition: doubleClick,
        style: this._style
      })
    )

    this._select[this._select.length - 1].set('name', name || 'stopDraw')

    this._select[this._select.length - 1].on('select', (e) => {
      callBack && callBack(
        this._source.getFeatures()[0] && this._source.getFeatures()[0].getGeometry().getCoordinates()
      )
    })
    return this._select[this._select.length - 1]
  }

  /**
   * @description 返回搜索到的 _select 仓库中的 interaction 实例
   *
   * @param {String} options interaction 实例的名字
   * @return {import('ol/interaction/Interaction').default} interaction 实例
   */
  searchInteraction (options) {
    let interaction, i
    this._select.forEach((item, index) => {
      if (item.get('name') === options) {
        interaction = item
        i = index
      }
    })

    return { interaction: interaction, index: i, ol_uid: interaction && interaction.ol_uid }
  }

  /**
   * @description 移除 _select 仓库中的 interaction 实例
   *
   * @param {import('ol/interaction/Interaction').default | Array<import('ol/interaction/Interaction').default>} options interaction 实例或者 interaction 实例数组
   */
  removeInteraction (options) {
    if (Array.isArray(options)) {
      options.forEach(item => {
        const { index: index } = this.searchInteraction(item.get('name'))
        if (index || index !== undefined) {
          this._select.splice(index, 1)
        }
      })
    } else {
      const { index: index } = this.searchInteraction(options.get('name'))
      if (index || index !== undefined) {
        this._select.splice(index, 1)
      }
    }
  }
}
