/**
 *
 * @description return WMTS of layer
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 */

import { getWidth, getTopLeft, applyTransform } from 'ol/extent'
import WMTS from 'ol/tilegrid/WMTS'
import { WMTS as WMTSSource } from 'ol/source'
import TileLayer from 'ol/layer/Tile'
import { get, getTransform } from 'ol/proj'

/**
 * @description 获得一个OpenLayers框架下的ol/layer/Tile类型天地图图层
 *
 * @param {options.type} String WMTS服务提供的图层样式
 * @param {options.proj} String 投影坐标系类型
 * @param {options.matrixSet} String 矩阵集
 * @param {options.format} String 图像格式
 * @param {options.key} String 开发者秘钥
 * @param {options.url} String 地图瓦片基础url
 * @param {Number} [options.maxZoom] 最大放大级别
 * @returns {import('ol/layer/Tile').default} 返回 source 为 WMTS 的 TileLayer
*/
export default function getLayerFromWMTS (options) {
  const projection = get(options.proj)
  const projectionExtent = projection.getExtent()
  const origin = projectionExtent ? getTopLeft(projectionExtent) : [-180, 90]
  const fromLonLat = getTransform('EPSG:4326', projection)
  const width = projectionExtent ? getWidth(projectionExtent) : getWidth(applyTransform([-180.0, -90.0, 180.0, 90.0], fromLonLat))

  const resolutions = []
  const matrixIds = []

  const { maxZoom = 18 } = options

  for (let z = 1; z < maxZoom + 1; z++) {
    resolutions[z] = width / (256 * Math.pow(2, z))
    matrixIds[z] = z
  }

  const wmtsTileGrid = new WMTS({
    origin: origin,
    resolutions: resolutions,
    matrixIds: matrixIds
  })

  const wmtsSource = new WMTSSource({
    url: options.url + options.key,
    layer: options.type,
    version: '1.0.0',
    matrixSet: options.matrixSet,
    format: options.format,
    projection: projection,
    requestEncoding: 'KVP',
    style: 'default',
    tileGrid: wmtsTileGrid
  })

  const wmtsLayer = new TileLayer({ source: wmtsSource })

  return wmtsLayer
}
