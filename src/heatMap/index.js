/**
 *
 * @description 创建热力图
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Heatmap as HeatmapLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import BaseFeature from '../baseFeature'

/**
 * @typedef heatInfo
 * @property {Number[]} point 热力中心点
 * @property {Number} weight 热力权重
 * @property {String} [name] feature 的名字
 */

export default class HeatMap extends BaseFeature {
  /**
   * @description 创建热力图的类
   *
   * @param {Object} options
   * @param {String} [options.name] 热力图层的名字
   * @param {Number} [options.blur] 模糊尺寸
   * @param {Number} [options.radius] 热点半径
   */
  constructor (options) {
    super()

    /** @description 保存创建实例时,传入的全部参数 */
    this._options = options

    /** @description 用于储存 feature 的仓库 */
    this._feature = []

    /** @description 用于储存 select 的仓库 */
    this._select = []

    /** @description 创建源 */
    this._source = new VectorSource({ wrapX: false })

    /** @description 创建热力图层 */
    this._layer = new HeatmapLayer({
      source: this._source,
      blur: this._options.blur || 20,
      radius: this._options.radius || 20,
      weight: (feature) => this._returnWeight(feature)
    })

    /** @description 设置 _layer 图层名字 */
    this._layer.set('name', this._options.name || 'heatMap')
  }

  /**
   * @description 返回 feature 的 weight 属性
   *
   * @param {import('ol/Feature').default} options feature 实例
   */
  _returnWeight (options) {
    return options.get('weight').toString()
  }

  /**
   * @description 创建热力 Feature 实例
   *
   * @param {heatInfo || Array<heatInfo>} options
   */
  create (options) {
    if (Array.isArray(options)) {
      const array = options.map(item => {
        return new Feature({
          item: item,
          name: item.name,
          weight: item.weight,
          geometry: new Point(item.point)
        })
      })

      this._feature = this._feature.concat(array)
      this._addFeature(array)
    } else {
      const feature = new Feature({
        item: options,
        name: options.name,
        weight: options.weight,
        geometry: new Point(options.point)
      })

      this._feature.push(feature)
      this._addFeature(feature)
    }

    return { layer: this._layer, feature: this._feature }
  }
}
