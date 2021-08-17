/**
 *
 * @description icon 标注点
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

import BaseFeature from '../baseFeature'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Select from 'ol/interaction/Select'
import { click } from 'ol/events/condition'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Icon, Style, Fill, Text } from 'ol/style'

/**
 * @typedef {Object} CreatePointOptions 创建点方法的参数
 * @property {Number[]} point 点位置的数组
 * @property {String} name 图层的名字,可以不填
 * @property {String} label 标签的提示
 */

export default class IconMarker extends BaseFeature {
  /**
   * @description 创建 icon 点的类
   *
   * @param {Object} options
   * @param {import('ol/map').default} options.map openlayers 的 Map 实例
   * @param {String} options.iconUrl 点的 icon url
   * @param {Number[]} options.offset 标注字体的偏移量
   * @param {String} options.fontStyle 标注字体的样式, 和 css 中的 font 字段一样
   * @param {String} options.fontColor 标注字体的颜色
   */
  constructor (options) {
    super()

    /** @description 保存创建实例时, 传入的全部参数 */
    this._options = options

    /** @description 用于储存 feature 实例仓库 */
    this._feature = []

    /** @description 用于储存 interaction 的 select 实例仓库 */
    this._select = []

    /** @description 创建源 */
    this._source = new VectorSource({ wrapX: false })

    /** @description 创建图层 */
    this._layer = new VectorLayer({
      source: this._source,
      style: (feature) => this._returnStyle(feature)
    })

    this._layer.set('name', options.name || 'iconPoint')
  }

  /**
   * @description 创建 Style 实例
   *
   * @param {import('ol/Feature').default} feature feature 实例
   * @return {import('ol/style/Style').default} Style 实例
   */
  _returnStyle (feature) {
    const { offset = [0, 0] } = this._options

    const _name = (feature.get('label') || '').toString()
    const _offsetX = offset[0]
    const _offsetY = offset[1]

    const image = new Icon({
      src: this._options.iconUrl
    })

    const text = new Text({
      font: this._options.fontStyle || '15px Microsoft YaHei',
      text: _name,
      fill: new Fill({
        color: this._options.fontColor || '#333'
      }),
      offsetX: _offsetX,
      offsetY: _offsetY
    })

    return new Style({
      text,
      image
    })
  }

  /**
   * @description 创建 icon 点的方法
   *
   * @param {CreatePointOptions | CreatePointOptions[]} options 创建点的配置
   */
  create (options) {
    if (Array.isArray(options)) {
      const array = options.map(item => {
        return new Feature({
          item: item,
          name: item.name,
          label: item.label,
          geometry: new Point(item.point)
        })
      })

      this._feature = this._feature.concat(array)
      this._addFeature(array)
    } else {
      const feature = new Feature({
        item: options,
        name: options.name,
        label: options.label,
        geometry: new Point(options.point)
      })
      this._feature.push(feature)
      this._addFeature(feature)
    }

    return { layer: this._layer, feature: this._feature }
  }

  /**
   * @description 添加鼠标事件
   *
   * @param {String} name interaction 实例的名字
   * @param {Function} callBack 回调函数
   * @return {import('ol/interaction/Select').default} interaction 的实例
   */
  addClick (name, callBack) {
    this._select.push(
      new Select({
        condition: click,
        layers: [this._layer],
        style: (feature) => this._returnStyle(feature)
      })
    )

    // 设置 select 的名字
    this._select[this._select.length - 1].set('name', name || 'clickSelect')

    this._select[this._select.lenght - 1].on('select', e => {
      if (e.selected.length === 0) return
      callBack && callBack({
        zoom: parseInt(this._options.map.getView().getZoom()),
        item: e.selected[e.selected.length - 1].get('item')
      })
    })

    return this._select[this._select.length - 1]
  }
}
