/**
 * @description 公路开发调用地图
 * @author OctopusRoe
 * @version 0.0.1
 */

import XYZ from 'ol/source/XYZ'
import TileGrid from 'ol/tilegrid/TileGrid'
import Tile from 'ol/layer/Tile'

/**
 *
 * @param {Object} options
 * @param {Object} options.data 从地图服务器获取的地图json数据
 * @param {String} options.proj 投影坐标系
 * @param {String} options.url 地图服务器地址
 */
export default function useGLKF (options) {
  const { data, proj, url } = options

  const resolutions = []
  const origin = [data.tileInfo.origin.x, data.tileInfo.origin.y]
  const len = data.tileInfo.lods.length
  const fullExtent = [data.fullExtent.xmin, data.fullExtent.ymin, data.fullExtent.xmax, data.fullExtent.ymax]

  for (let i = 0; i < len; i++) {
    resolutions.push(data.tileInfo.lods[i].resolution)
  }

  const tileGrid = new TileGrid({
    tileSize: data.tileInfo.cols,
    origin: origin,
    extent: fullExtent,
    resolutions: resolutions
  })

  const urlTemplate = url + '/tile/{z}/{y}/{x}'
  const tileArcGISXYZ = new XYZ({
    tileGrid: tileGrid,
    projection: proj,
    tileUrlFunction: (tileCoord) => {
      const url = urlTemplate.replace('{z}', (tileCoord[0]).toString()).replace('{x}', tileCoord[1].toString()).replace('{y}', (tileCoord[2]).toString())
      return url
    }
  })

  const tile = new Tile({ source: tileArcGISXYZ })

  return tile
}
