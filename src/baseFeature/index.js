/**
 *
 * @description 基础原型
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'

export default class BaseFeature {
  constructor () {
    this._options = { map: null }

    /** @description 用于储存 feature 的仓库 */
    this._feature = []

    /** @description 用于储存 select 的仓库 */
    this._select = []

    /** @description 用于储存 layer 的仓库 */
    this._layer = new VectorLayer()

    /** @description 用于储存 source 的仓库 */
    this._source = new VectorSource({ wrapX: false })
  }

  /** @description 获取 layer 仓库 */
  get layer () {
    return this._layer
  }

  /** @description 获取 interaction 仓库 */
  get interaction () {
    return this._select.concat()
  }

  /** @description 获取 feature 仓库 */
  get feature () {
    return this._feature.concat()
  }

  /** @description 把 Feature 加入 source */
  _addFeature (options) {
    if (Array.isArray(options)) {
      this._source.addFeatures(options)
    } else {
      this._source.addFeature(options)
    }
  }

  /**
   * @description 根据传入的参数返回查询到的 feature 实例
   *
   * @param {String} options feature 的名字
   * @return {{feature: import('ol/Feature').default, index: Number, ol_uid: Number}} 返回查询到的 feature 实例
   */
  searchFeature (options) {
    let feature, i
    this._feature.forEach((item, index) => {
      if (item.get('name') === options) {
        feature = item
        i = index
      }
    })

    return { feature: feature, index: i, ol_uid: feature && feature.ol_uid }
  }

  /**
   * @description 根据传入的参数返回查询到的 feature 实例数组
   *
   * @param {String | String[]} options feature 的名字或名字数组
   * @return {Array<import('ol/Feature').default>} feature 所组成的数组
   */
  searchFeatures (options) {
    const featureArray = []
    if (Array.isArray(options)) {
      options.forEach(item => {
        const feature = this.searchFeatures(item)
        featureArray.push(...feature)
      })
    } else {
      this._feature.forEach(item => {
        if (item.get('name') === options) {
          featureArray.push(item)
        }
      })
    }

    return featureArray
  }

  /**
   * @description 移除矢量图形
   *
   * @param {import('ol/Feature').default | Array<import('ol/Feature').default>} options feature 实例或 feature 实例数组
   */
  removeFeature (options) {
    if (Array.isArray(options)) {
      options.forEach(item => {
        this.removeFeature(item)
      })
    } else {
      const { index: index } = this.searchFeature(options.get('name'))
      if (index === undefined) return
      this._feature.splice(index, 1)
      this._source.removeFeature(options)
    }
  }

  /**
   * @description 根据传入的参数返回查询到的 interaction 实例
   *
   * @param {String} options interaction 的名字
   * @return {import('ol/interaction/Interaction').default} 返回查询到的 interaction
   */
  searchInteraction (options) {
    let interaction
    this._select.forEach(item => {
      if (item.get('name') === options) {
        interaction = item
      }
    })
    return { interaction: interaction, ol_uid: interaction && interaction.ol_uid }
  }

  /**
   * @description 根据传入的参数返回查询到的 interaction 实例数组
   *
   * @param {String | String[]} options interaction 的名字或者名字数组
   * @return {Array<import('ol/interaction/Interaction').default>} interaction 所组成的数组
   */
  searchInteractions (options) {
    const interactionArray = []
    if (Array.isArray(options)) {
      options.forEach(item => {
        const interaction = this.searchInteractions(item)
        interactionArray.push(...interaction)
      })
    } else {
      this._select.forEach(item => {
        if (item.get('name') === options) {
          interactionArray.push(item)
        }
      })
    }

    return interactionArray
  }

  /**
   * @description 根据传入的参数删除仓库中的 interaction 实例
   *
   * @param {import('ol/interaction/Interaction').default | Array<import('ol/interaction/Interaction').default>} options interaction 实例或者 interaction 实例数组
   */
  removeInteraction (options) {
    if (Array.isArray(options)) {
      options.forEach(item => {
        this.removeInteraction(item)
      })
    } else {
      const { index: index } = this.searchInteraction(options.get('name'))
      if (index || index !== undefined) {
        this._select.splice(index, 1)
        this._options.map && this._options.map.removeInteraction(options)
      }
    }
  }
}
