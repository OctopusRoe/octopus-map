/**
 *
 * @description 纯文本标记
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

import BaseFeature from '../baseFeature'
import Feature from 'ol/Feature'
import Select from 'ol/interaction/Select'
import Point from 'ol/geom/Point'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { click, pointerMove } from 'ol/events/condition'
import { Style, Text as TextStyle, Fill } from 'ol/style'

/**
 * @typedef {Object} createTextOptions
 * @property {Number[]} point 点坐标的数组
 * @property {String} name feature 实例的名字, 可以不填
 * @property {String} label 提示标注
 */

export default class Text extends BaseFeature {
  /**
   * @param {Object} options
   * @param {String} options.name layer 图层的名字
   * @param {String} options.fontStyle 标注字体样式, 和 css 中的 font 字段一样
   * @param {Number[]} options.offSet 标注字体的偏移量
   * @param {String} options.color 标注字体的颜色
   * @param {{color: String, url?: String}} [options.background] 默认不填 标注的背景颜色或者图案
   * @param {{color: String, url?: String}} [options.condition] 默认不填 点击或者选择时的标注背景颜色或图案
   */
  constructor (options) {
    super()

    /** @description 保存创建实例时 传入的全部参数 */
    this._options = options

    /** @description 用于储存 feature 实例的仓库 */
    this._feature = []

    /** @description 用于储存 interaction 的 select 实例仓库 */
    this._select = []

    /** @description 创建源 */
    this._source = new VectorSource({ wrapX: false })

    /** @description 创建图层 */
    this._layer = new VectorLayer({
      source: this._source,
      style: (feature) => this._returnStyle(
        feature,
        {
          fontStyle: options.fontStyle || '15px Microsoft YaHei',
          background: options.background || { color: '' },
          color: options.color || '#333',
          offset: options.offset || [0, 0]
        }
      )
    })

    this._layer.set('name', options.name || 'fontLayer')
  }

  /**
   * @description 创建文字样式
   *
   * @param {import('ol/Feature').default} feature Feature 的实例
   * @param {Object} options
   * @param {String} options.fontStyle 标注字体样式, 和 css 中的 font 字段一样
   * @param {Number[]} options.offSet 标注字体的偏移量
   * @param {String} options.color 标注字体的颜色
   * @param {{color?: String, url?: String}} options.background 标注的背景颜色或者图案
   * @return {import('ol/style/Style').default} Style 实例
   */
  _returnStyle (feature, options) {
    const text = new TextStyle({
      text: (feature.get('label') || '').toString(),
      font: options.fontStyle,
      fill: new Fill({
        color: options.color
      }),
      offsetX: options.offset[0],
      offsetY: options.offset[1]
    })

    if (options.background !== undefined || options.background !== null) {
      if (options.background.color && options.background.color !== '') {
        const background = new Fill({
          color: options.background.color
        })

        text.setBackgroundFill(background)
      }

      if (options.background.url && options.background.url !== '') {
        this._setIconStyle(options)
      }
    }
    const style = new Style()
    style.setText(text)
    return style
  }

  /**
   * @description 创建背景是图片的文字样式
   *
   * @param {Object} options
   * @param {String} options.fontStyle 标注字体样式, 和 css 中的 font 字段一样
   * @param {Number[]} options.offSet 标注字体的偏移量
   * @param {String} options.color 标注字体的颜色
   * @param {{color?: String, url?: String}} options.background 标注的背景颜色或者图案
   */
  _setIconStyle (options) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    const img = new Image()
    img.src = options.background.url

    img.onload = () => {
      const pattern = context.createPattern(img, 'repeat')
      /** */
      this._layer.setStyle((feature) => {
        const style = new Style()
        const iconText = new TextStyle({
          text: (feature.get('label') || '').toString(),
          font: options.fontStyle,
          fill: new Fill({
            color: options.color
          }),
          backgroundFill: new Fill({
            color: pattern
          }),
          offsetX: options.offset[0],
          offsetY: options.offset[1]
        })
        style.setText(iconText)
        return style
      })
    }
  }

  /**
   * @description 用于创建icon类型的文字标注
   *
   * @param {createTextOptions | createTextOptions[]} options 参数
   * @return {import('ol/Feature').default} Feature 的实例
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
   * @description 用于创建选择事件的 interaction
   *
   * @param {String | undefind | null} name interaction 图层名字
   * @param {Function | undefind | null} callBack 回调函数
   * @return {import('ol/interaction/Select').default} Select 实例
   */
  addSelect (name, callBack) {
    this._select.push(
      new Select({
        condition: pointerMove,
        layers: [this._layer],
        style: (feature) => this._returnStyle(
          feature,
          {
            fontStyle: this._options.fontStyle || '15px Microsoft YaHei',

            // this._options 中 有 condition 配置
            // 判断 condition 中是否含有 background 并且不为空
            // 为空有使用 this._options 中的 background 配置
            // this._options 中 没有 condition 配置
            // 使用 this._options 中的 background 配置
            background: this._options.condition ? this._options.condition.background || this._options.background : this._options.background,

            // this._options 中 有 condition 配置
            // 判断 condition 中是否含有 color 并且不为空值
            // 为空使用 this._options 中的 color 配置
            // this._options 中 没有 condition 配置
            // 使用 this._options 中的 color 配置
            color: this._options.condition ? this._options.condition.color || this._options.color : this._options.color,
            offset: this._options.offset || [0, 0]
          }
        )
      })
    )

    /** @description 添加 name 属性 */
    this._select[this._select.length - 1].set('name', name || 'textSelect')

    this._select[this._select.length - 1].on('select', e => {
      if (e.selected.length === 0) return
      callBack && callBack({
        zoom: Math.ceil(this._options.map.getView().getZoom()),
        value: e.selected[e.selected.length - 1].get('item')
      })
    })

    return this._select[this._select.length - 1]
  }

  /**
   * @description 用于创建点击事件的 interaction
   *
   * @param {String | undefind | null} name interaction 图层名字
   * @param {Function | undefind | null} callBack 回调函数
   * @return {import('ol/interaction/Select').default} Select 实例
   */
  addClick (name, callBack) {
    this._select.push(new Select({
      condition: click,
      layers: [this._layer],
      style: (feature) => this._returnStyle(
        feature,
        {
          fontStyle: this._options.fontStyle || '15px Microsoft YaHei',

          // this._options 中 有 condition 配置
          // 判断 condition 中是否含有 background 并且不为空
          // 为空使用 this._options 中的 background 配置
          // this._options 中 没有 condition 配置
          // this._options 中的 background 配置
          background: this._options.condition ? this._options.condition.background || this._options.background : this._options.background,

          // this._options 中 有 condition 配置
          // 判断 condition 中是否含有 color 并且不为空值
          // 为空使用 this._options 中的 color 配置
          // this._options 中 没有 condition 配置
          // 使用 this._options 中的 color 配置
          color: this._options.condition ? this._options.condition.color || this._options.color : this._options.color,
          offset: this._options.offset || [0, 0]
        }
      )
    })
    )

    /** @description 添加 name 属性 */
    this._select[this._select.length - 1].set('name', name || 'textClick')

    this._select[this._select.length - 1].on('select', e => {
      if (e.selected.length === 0) return
      callBack && callBack({
        zoom: Math.ceil(this._options.map.getView().getZoom()),
        value: e.selected[e.selected.length - 1].get('item')
      })
    })

    return this._select[this._select.length - 1]
  }
}
