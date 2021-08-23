/**
 *
 * @description 返回采用天地图瓦片的 layer
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

import { getWidth, getTopLeft, applyTransform } from 'ol/extent'
import WMTS from 'ol/tilegrid/WMTS'
import { WMTS as WMTSSource } from 'ol/source'
import TileLayer from 'ol/layer/Tile'
import { get, getTransform } from 'ol/proj'

/** @description 天地图提供的数据图层 */
const TIAN_DI_TU_LAYERS = {
  /** @description 全球境界 */
  ibo: 'ibo',
  /** @description 地形注记 */
  cta: 'cta',
  /** @description 地形晕渲 */
  ter: 'ter',
  /** @description 影像注记  */
  cia: 'cia',
  /** @description 影像底图 */
  img: 'img',
  /** @description 矢量注记 */
  cva: 'cva',
  /** @description 矢量底图 */
  vec: 'vec'
}

/** @description 投影坐标系 */
const PROJS = {
  /** @description CGCS2000 */
  'EPSG:4490': 'EPSG:4490',
  /** @description WGS84 */
  'EPSG:4326': 'EPSG:4326',
  /** @description Mercator */
  'EPSG:3857': 'EPSG:3857',
  /** @description Mercator */
  WEB: 'EPSG:900913'
}

/** @description matrix_sets */
const MATRIX_SETS = {
  'EPSG:4490': 'c',
  'EPSG:4326': 'c',
  'EPSG:3857': 'c',
  WEB: 'w'
}

/**
 * @description 创建使用天地图瓦片的 layer
 *
 * @param {Object} options 传入的参数对象
 * @param {String} options.type 天地图提供的数据图层
 * @param {String} options.proj 投影坐标系类型
 * @param {String} options.key 开发者秘钥
 * @param {String} options.url 天地图瓦片基础url
 * @param {Number} [options.maxZoom] 最大放大级别
 */

export default function useTianDiTu (options) {
  const projection = get(PROJS[options.proj])
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
    url: options.url + TIAN_DI_TU_LAYERS[options.type] + '_' + MATRIX_SETS[options.proj] + '/wmts?tk=' + options.key,
    layer: TIAN_DI_TU_LAYERS[options.type],
    version: '1.0.0',
    matrixSet: MATRIX_SETS[options.proj],
    format: 'tiles',
    projection: projection,
    requestEncoding: 'KVP',
    style: 'default',
    tileGrid: wmtsTileGrid
  })

  const wmtsLayer = new TileLayer({ source: wmtsSource })
  return wmtsLayer
}
