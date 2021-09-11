/**
 *
 * @description 通过画图来选择
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 */

import Polygon from 'ol/geom/Polygon'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Draw, { createBox, createRegularPolygon } from 'ol/interaction/Draw'
import { Style, Fill, Stroke, Text } from 'ol/style'

export default class DrawSelect {
  /**
   * @description 创建 DrawSelect 框选实例
   *
   * @param {Object} options
   */
  constructor (options) {
    /** @description 创建源 */
    this._source = new VectorSource({ wrapX: false })

    this._layer = new VectorLayer({
      source: this._source,
      style: (feature) => this._returnStyle(feature)
    })
  }

  /**
   * @description 创建 Style 实例
   *
   * @param {import('ol/Feature').default} feature Feature 实例
   */
  _returnStyle (feature) {

  }

  /** @description 暴露到外部的开始方法, 返回 Layer 和 interaction */
  create () {

  }

  resetSelect () {

  }
}
