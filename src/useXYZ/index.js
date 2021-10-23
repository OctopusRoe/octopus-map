/**
 *
 * @description return XYZ of layer
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 * */

import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { get } from 'ol/proj'

/**
 * @description 获得一个Openlayers框架下的ol/layer/Tile类型XYZ图层
 *
 * @param {Object} options
 * @param {String} options.proj 投影坐标系类型
 * @param {String} options.url 地图瓦片基础url
 * @param {Number} [options.maxZoom] 最大放大级别
 * @returns {import('ol/layer/tile').default} 返回 source 为 XYZ 的 TileLayer
 */
export default function getLayerFromXYZ (options) {
  const projection = get(options.proj)

  const xyzSource = new XYZ({
    url: options.url,
    projection: projection,
    maxZoom: options.maxZoom
  })

  const xyzLayer = new TileLayer({ source: xyzSource })

  return xyzLayer
}
