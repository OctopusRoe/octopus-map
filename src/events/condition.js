/**
 *
 * @description add some new mapBrowserEvent
 *
 * @author OctopusRoe
 *
 * @version 0.0.1
 *
 */

/**
 * @description Reature `true` if only the mouse right button click
 *
 * @param {import('ol/MapBrowserEvent').default} MapBrowserEvent Map browser event
 * @return {Boolean} true if only the mouse right button click
 */
export function rightMouseDown (mapBrowserEvent) {
  const originalEvent = mapBrowserEvent.originalEvent
  return originalEvent.button === 2 && originalEvent.pointerType
}

/**
 * @description Reature `true` if only the mouse wheel use
 *
 * @param {import('ol/MapBrowserEvent').default} mapBrowserEvent Map browser event
 * @returns {Boolean} true if only the mouse wheel use
 */
export function mouseWheel (mapBrowserEvent) {
  const originalEvent = mapBrowserEvent.originalEvent
  return originalEvent.type === 'wheel'
}
