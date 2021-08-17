/**
 *
 * @description 常用坐标系转化
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

import { toLonLat, transform } from 'ol/proj'

const x_PI = 3.14159265358979324 * 3000.0 / 180.0
const PI = 3.1415926535897932384626
const a = 6378245.0
const ee = 0.00669342162296594323

/**
 * @description mercator 转换为 经纬度
 *
 * @param {Number[]} mercatorArray [x, y]
 * @returns {Number[]} [lon, lat]
 */
export function merTolonlat (mercatorArray) {
  return toLonLat(mercatorArray, 'EPSG:3857')
}

/**
 * @description 经纬度 转换为 mercator
 *
 * @param {Number[]} lonlatArray [lon, lat]
 * @returns {Number[]} [x, y]
 */
export function lonlatToMer (logLatArray) {
  return transform(logLatArray, 'EPSG:4326', 'EPSG:3857')
}

/**
 * @description 百度(BD-09) 与 火星坐标系(GCJ-02)转换,百度转高德或者谷歌
 *
 * @param {Number[]} BDArray [lon, lat]
 * @returns {Number[]} GCJ-02[lon, lat]
 */
export function bdToGCj (BDArray) {
  const x = BDArray[0] - 0.0065
  const y = BDArray[1] - 0.006
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI)
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI)
  const GCJ_lon = z * Math.cos(theta)
  const GCJ_lat = z * Math.sin(theta)
  return [GCJ_lon, GCJ_lat]
}

/**
 * @description 火星坐标系(GCJ-02) 与 百度(BD-09)转换
 *
 * @param {Number[]} GCJArray [lon, lat]
 * @returns {Number[]} BD-09[lon, lat]
 */
export function gcjToBd (GCJArray) {
  const lon = GCJArray[0]
  const lat = GCJArray[1]
  const z = Math.sqrt(lon * lon + lat * lat) + 0.00002 * Math.sin(lat * x_PI)
  const theta = Math.atan2(lat, lon) + 0.000003 * Math.cos(lon * x_PI)
  const bd_lon = z * Math.cos(theta) + 0.0065
  const bd_lat = z * Math.sin(theta) + 0.006
  return [bd_lon, bd_lat]
}

/**
 * @description WGS84坐标系转换为火星坐标系(GCJ-02)
 *
 * @param {Number[]} WGSArray
 * @returns {Number[]} GCJ-02[lon, lat]
 */
export function wgsToGcj (WGSArray) {
  const lng = WGSArray[0]
  const lat = WGSArray[1]
  if (out_of_china(lng, lat)) {
    return WGSArray
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0)
    var dlng = transformlng(lng - 105.0, lat - 35.0)
    var radlat = lat / 180.0 * PI
    var magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    var sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
    var mglat = lat + dlat
    var mglng = lng + dlng
    return [mglng, mglat]
  }
}

/**
 * @description 火星坐标系(GCJ-02) 与 WGS84转换
 *
 * @param {Number[]} GCJArray GCJ-02[lon, lat]
 * @returns {Number[]} WGS84[lon, lat]
 */
export function gcjToWgs (GCJArray) {
  const lng = GCJArray[0]
  const lat = GCJArray[1]

  if (outOfChina(lng, lat)) {
    return GCJArray
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0)
    var dlng = transformlng(lng - 105.0, lat - 35.0)
    var radlat = lat / 180.0 * PI
    var magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    var sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
    const mglat = lat + dlat
    const mglng = lng + dlng
    return [lng * 2 - mglng, lat * 2 - mglat]
  }
}
function transformlat (lng, lat) {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
  return ret
}
function transformlng (lng, lat) {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
  return ret
}
/**
 * 判断是否在国内，不在国内则不做偏移
 */
export function outOfChina (lng, lat) {
  return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false)
}

export default {
  merTolonlat,
  lonlatToMer,
  bdToGCj,
  gcjToBd,
  wgsToGcj,
  gcjToWgs
}
