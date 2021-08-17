/**
 *
 * @description 修改线段与网格的类
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

import Select from 'ol/interaction/Select'
import { doubleClick } from 'ol/events/condition'
import { Modify, Snap } from 'ol/interaction'
import { Style, Stroke, Circle, Fill, Icon } from 'ol/style'

/**
  * @typedef style
  * @property {Number} [radius] 坐标点直径
  * @property {{width: Number, color: String}} [stroke] 坐标点外边框
  * @property {Number} [width] 路径宽度
  * @property {String} [color] 颜色,同 css 的 color 字段
  */

export default class DrawModify {
  /**
   *
   * @param {Object} options
   * @param {import('ol/layer/Vector').default} options.layer 需要修改的 layer 层
   * @param {style} [options.style] 样式配置
   * @param {String} [options.iconUrl] 节点图标
   */
  constructor (options) {
    /** @description 保存创建实例时, 传入的全部参数 */
    this._options = options

    /** @description 用于存储 interaction 的实例仓库 */
    this._select = []

    /** @description 创建样式 */
    this._style = this._createStyle(options)

    /** @description 创建源 */
    this._source = options.layer.getSource()
  }

  /** @description 返回 _select 仓库中的所有 interaction 实例 */
  get interactions () {
    return this._select
  }

  /**
   * @description 创建样式
   *
   * @param {Object} options 创建实例时传入的参数
   */
  _createStyle (options) {
    const { style = {}} = options
    const { stroke } = style

    const image = options.iconUrl
      ? new Icon({
        src: options.iconUrl
      })
      : new Circle({
        radius: style && style.radius || 6,
        stroke: stroke && new Stroke({
          width: stroke.width || 2,
          color: stroke.color || 'rgba(255, 255, 255 ,1)'
        }),
        fill: new Fill({
          color: style && style.color || 'rgba(0, 0, 255, 0.5)'
        })
      })

    return new Style({
      stroke: new Stroke({
        color: style && style.color || 'rgba(0, 0, 255, 0.5)',
        width: style && style.width || 6
      }),
      image: image
    })
  }

  /**
   * @description 创建修改
   *
   * @returns {import('ol/interaction/Interaction').default} 返回 interaction 实例
   */
  _createModify () {
    this._select.push(
      new Modify({
        source: this._source,
        style: this._style
      })
    )

    return this._select[this._select.length - 1]
  }

  /**
   * @description 创建捕捉
   *
   * @return {import('ol/interaction/Interaction').default} 返回 interaction 实例
   */
  _createSnap () {
    this._select.push(
      new Snap({
        source: this._source
      })
    )

    return this._select[this._select.length - 1]
  }

  /**
   * @description 暴露的实例方法,用于创建修改图层
   *
   * @param {String} [name] 设置 interaction 名字
   * @return {Array<import('ol/interaction/Interaction').default>} interaction 实例数组
   */
  create (name) {
    const modify = this._createModify(name)
    const snap = this._createSnap(name)

    modify.set('name', name || 'drawModify')
    snap.set('name', name || 'drawModify')

    return { interaction: [modify, snap] }
  }

  /**
   * @description 双击鼠标左键获取 _source
   *
   * @param {String} name interaction 实例名称
   * @param {Function} callBack 回调函数
   * @returns {import('ol/interaction/Interaction').default} 返回 interaction 实例
   */
  stopModify (name, callBack) {
    // 加入 _select 仓库
    this._select.push(
      new Select({
        condition: doubleClick,
        style: this._style
      })
    )

    // 设置名称
    this._select[this._select.length - 1].set('name', name || 'stopModify')

    this._select[this._select.length - 1].on('select', (e) => {
      callBack && callBack(
        this._source.getFeatures()
      )
    })

    return this._select[this._select.length - 1]
  }

  /**
   * @description 返回搜索到的 _select 仓库中的 interaction 实例
   *
   * @param {String} options interaction 实例的名字
   * @return {import('ol/interaction/Interaction').default} interaction 实例
   */
  searchInteraction (options) {
    let interaction, i
    this._select.forEach((item, index) => {
      if (item.get('name') === options) {
        interaction = item
        i = index
      }
    })

    return { interaction: interaction, index: i, ol_uid: interaction && interaction.ol_uid }
  }

  /**
   * @description 移除 _select 仓库中的 interaction 实例
   *
   * @param {import('ol/interaction/Interaction').default | Array<import('ol/interaction/Interaction').default>} options interaction 实例或者 interaction 实例数组
   */
  removeInteraction (options) {
    if (Array.isArray(options)) {
      options.forEach(item => {
        const { index: index } = this.searchInteraction(item.get('name'))
        if (index || index !== undefined) {
          this._select.splice(index, 1)
        }
      })
    } else {
      const { index: index } = this.searchInteraction(options.get('name'))
      if (index || index !== undefined) {
        this._select.splice(index, 1)
      }
    }
  }
}
