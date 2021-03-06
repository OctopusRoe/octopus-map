/**
 *
 * @description dom 标注点
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

import Overlay from 'ol/Overlay'

/**
 * @typedef createPointOptions
 * @property {String} name overlay 的名字
 * @property {String} id 设置 Dom 容器的 ID
 * @property {Number[]} point 点位置的数组
 * @property {String} label Dom 标注的提示信息
 * @property {Element | String | undefined} [innerHTML] dom 或者 dom 字符串模板
 * @property {String} [positioning] dom 对于 position 的定位方式
 * @property {String} [className] dom 的 css 类名
 * @property {Boolean} [stopEvent] 是否禁止事件传递到地图视图, 默认为否,不禁止
 */

export default class DomMarker {
  /**
   * @description 创建 dom 点的类
   *
   * @param {Object} options
   * @param {import('ol/map').default} options.map openlayers 的 Map 实例
   * @param {Array<import('ol/Overlay').default>} options.overlay Overlay 实例的数组
   * @param {Number[]} options.offset overlay 整体偏移量
   * @param {Element | String | undefined} [options.innerHTML] dom 字符串模板
   * @param {Boolean} options.useTitle 是否使用 dom 标签的 title 属性
   */
  constructor (options) {
    /** @description 用于储存 overlay 实例的仓库 */
    this._overlay = []

    /** @description 保存创建实例时, 传入的全部参数 */
    this._options = options
  }

  /** @description 获取 overlay 数组 */
  get overlays () {
    return this._overlay.concat()
  }

  /**
   * @description 创建 dom 节点容器
   * @return 返回一个 dom 容器
   */
  _createMarkElement () {
    const div = document.createElement('div')
    div.setAttribute('target', 'marker')
    return div
  }

  /**
   * @description 创建一个 Overlay 实例的私有方法
   *
   * @param {createPointOptions} options 创建点的配置
   * @return {import('ol/Overlay').default} 返回 Overlay 实例
   */
  _createOneOverlay (options) {
    // 创建 dom 容器
    const div = this._createMarkElement()

    if (options.innerHTML) {
      if (options.innerHTML instanceof Element) {
        div.insertAdjacentElement('afterbegin', options.innerHTML)
      } else {
        div.insertAdjacentHTML('afterbegin', options.innerHTML)
      }
    } else {
      // 把字符串模板塞入容器
      if (this._options.innerHTML instanceof Element) {
        div.insertAdjacentElement('afterbegin', this._options.innerHTML)
      } else {
        div.insertAdjacentHTML('afterbegin', this._options.innerHTML)
      }
    }

    // 判断是否使用 title 属性
    if (this._options.useTitle) {
      // 给容器添加 title 属性
      div.title = options.label
    }

    // 保存到 div 上时,清除 innerHTML 属性
    delete options.innerHTML

    // 创建 Overlay 实例
    const overlay = new Overlay({
      id: options.id,
      element: div,
      position: options.point,
      positioning: options.positioning || 'bottom-center',
      offset: this._options.offset ? this._options.offset : [0, 0],
      className: options.className || 'ol-overlay-container ol-selectable',
      stopEvent: options.stopEvent || false
    })

    // 给 Overlay 实例添加 name 属性和值
    overlay.set('name', options.name || 'overlay')

    // 给 Overlay 实例上添加传入的数据
    overlay.set('data', options)

    // 返回 Overlay 实例
    return overlay
  }

  /**
   * @description 私有方法, 根据传入的参数返回查询到的 Overlay 实例
   *
   * @param {String} options Overlay 的名字
   * @param {Array<import('ol/Overlay').default>} array Overlay 组成的数组
   */
  _search (options, array) {
    let overlay, i
    array.forEach((item, index) => {
      if (item.get('name') === options) {
        overlay = item
        i = index
      }
    })

    return { overlay: overlay, index: i }
  }

  /**
   * @description 暴露到外部的实例方法
   *
   * @param {createPointOptions | createPointOptions[]} options 创建点的配置
   * @param {Element | String | undefined} [innerHTML] Element dom 节点或者HTML 字符串模板
   */
  create (options) {
    if (Array.isArray(options)) {
      const array = options.map(item => this._createOneOverlay(item))

      // 把 Overlay 实例数组保存进仓库中
      this._overlay = this._overlay.concat(array)
    } else {
      const overlay = this._createOneOverlay(options)

      // 把 Overlay 实例保存进仓库中
      this._overlay.push(overlay)
    }

    return { overlay: this._overlay }
  }

  /**
   * @description 给 overlay 实例中的 element 添加方法
   *
   * @param {Function} callBack 回调函数
   */
  addClick (callBack) {
    this._overlay.forEach(item => {
      const element = item.getElement()

      // 添加监听事件
      element.addEventListener('click', (event) => {
        event.stopPropagation()
        callBack && callBack({
          zoom: Math.ceil(this._options.map.getView().getZoom()),
          item: item.get('data')
        })
      })
    })
  }

  /**
   * @description 根据传入的参数返回查询到的 Overlay 实例
   *
   * @param {String} options Overlay 的名字
   * @return {{overlay: import('ol/Overlay').default, index: Number}} 返回查询到的数据
   */
  searchOverlay (options) {
    let overlay, i
    this._overlay.forEach((item, index) => {
      if (item.get('name') === options) {
        overlay = item
        i = index
      }
    })

    return { overlay: overlay, index: i }
  }

  /**
   * @description 根据传入的参数返回查询到的 Overlay 实例数组
   *
   * @param {String | String[]} options Overlay 的名字或名字数组
   * @return {Array<import('ol/Overlay').default>} Overlay 所组成的数组
   */
  searchOverlays (options) {
    const overlayArray = []
    if (Array.isArray(options)) {
      options.forEach(item => {
        const overlay = this.searchOverlays(item)
        overlayArray.push(...overlay)
      })
    } else {
      this._overlay.forEach(item => {
        if (item.get('name') === options) {
          overlayArray.push(item)
        }
      })
    }

    return overlayArray
  }

  /**
   * @description 移除 Overlay 实例
   *
   * @param {import('ol/Overlay').default | Array<import('ol/Overlay').default>} options Overlay 实例或者实例数组
   */
  removeOverlay (options) {
    if (Array.isArray(options)) {
      options.forEach(item => {
        this.removeOverlay(item)
      })
    } else {
      const { index: i } = this._search(options.get('name'), this._options.overlay)
      const { index: index } = this._search(options.get('name'), this._overlay)

      if (index === undefined || i === undefined) return

      this._overlay.splice(index, 1)
      this._options.overlay.splice(i, 1)

      this._options.map.removeOverlay(options)
    }
  }
}
