import { MapInit } from '@/src'
import { one } from './data'
const Tmap = new MapInit({
  target: 'root',
  useControl: false
})

Tmap.addView({
  center: [115.904642, 28.680854],
  proj: 'EPSG:4326',
  zoom: 15,
  minZoom: 7,
  maxZoom: 18
})
Tmap.useTianDiTu({
  type: ['vec', 'cva'],
  proj: 'EPSG:4326',
  key: 'a3f0bbf7db728e8db4ebbe860679d4bb',
  url: 'http://t{0-7}.tianditu.gov.cn/'
})
// Tmap.useWMTS({
//   type: 'bigemap.other',
//   // matrixSet: '7to15',
//   proj: 'EPSG:3857',
//   // format: 'image/png',
//   url: 'http://192.168.1.200:3001/bigemap.b461iq0w/wmts?access_token=',
//   key: 'pk.eyJ1IjoiY3VzXzBudnBwMHg1IiwiYSI6IjNvejI3ZnNqNG94NDk0Mm4xMzhxaW5jaWsiLCJ0IjoxfQ.bqPe0te9a0x5uQ0i9RJaUitezaMmiCxQmWIJYe_XutU'
// })
Tmap.on('click', (e) => {

  // const a = Tmap._getLonLat(e)
  //
})
document.getElementById('root').addEventListener('click', e => {
  console.log('%c 🍅 Tmap.getLonLat(e): ', 'font-size:20px;background-color: #465975;color:#fff;', Tmap.getLonLat(e))
})

const test = Tmap.Text({ name: 'test', color: '#fff',
  background: {
  // url: 'http://bbs.gd163.cn/UpFile/UpAttachment/2015-11/20151110184126.jpg'
    color: 'blue'
  },
  condition: { }
})
const a = [
  [115.890445, 28.674833],
  [115.904642, 28.680854],
  [115.898654, 28.684034],
  [115.899881, 28.68228]
]
a.forEach((item, index) => {
  test.create({ label: `测试${index + 1}`, point: item })
})

Tmap.addLayer(test.layer)

/* ****************** 网格 ****************** */
const grid = Tmap.GridPolygon()
grid.create({
  point: [one],
  name: 'test',
  label: 'test'
})
const add = grid.addSelect('testSelect', e => {
  console.log('%c 🍮 e: ', 'font-size:20px;background-color: #42b983;color:#fff;', e)
})
Tmap.addInteraction(add)
Tmap.addLayer(grid.layer)
const select = grid.addSelect()
Tmap.addInteraction(select)
/* ****************** 网格 ****************** */

/* ****************** 动画 ****************** */

const trajectory = Tmap.Trajectory({ repeat: true, iconUrl: require('./car.png').default })
Tmap.addLayer(trajectory.layer)
trajectory.create({
  name: 'testAnimation',
  route: a
})

// trajectory.start()

/* ****************** 动画 ****************** */

// // const Mark = Tmap.IconMarker({ icon: require('./car.png').default })
// // const iconMark = Mark.create({ point: [115, 28], name: 'iconMark', label: '张雄飞是2货' })
// // console.log('%c 🍛 iconMark: ', 'font-size:20px;background-color: #4b4b4b;color:#fff;', iconMark)
// // Tmap.addLayer(Mark.layer)
/* ****************** 动画 ****************** */

/* ****************** 热力 ****************** */
const heat = Tmap.HeatMap({ name: 'heatTest', blur: 40, radius: 40 })
heat.create({ point: [115.890445, 28.674833], weight: 0.9 })
Tmap.addLayer(heat.layer)

/* ****************** 热力 ****************** */

// /* ****************** 画网格 ****************** */

// const draw = Tmap.DrawLine({ name: 'drawLine', type: 'LineString' })
// const drawReturn = draw.create()
// Tmap.addLayer(drawReturn.layer)
// const testRm = draw.rmLastPoint('testRm')
// const testSt = draw.stopDraw('tset', (e) => {
//   console.log('%c 🍰 e: ', 'font-size:20px;background-color: #ED9EC7;color:#fff;', e)
//   // 参数 e 返回坐标数组
//   Tmap.removeInteraction(drawReturn.interaction)
// })

// Tmap.addInteraction([drawReturn.interaction, testRm, testSt])
// // Tmap.removeInteraction(testSt)
// // 重置方法
// setTimeout(() => {
//   const drawReturn = draw.create()
//   Tmap.addInteraction(drawReturn.interaction)
//   console.log('%c 🌶 Tmap.interaction: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', Tmap.interactions)
// }, 30 * 1000)

// /* ****************** 画网格 ****************** */

// /* ****************** 修改网格 **************** */
const drawModify = Tmap.DrawModify({ layer: trajectory.layer })
const drawModifyReturn = drawModify.create()
drawModify.stopModify('testStopModify', (e) => {
  console.log('%c 🍏 e: ', 'font-size:20px;background-color: #6EC1C2;color:#fff;', e)

  Tmap.removeInteraction(drawModify.interactions)
})
Tmap.addInteraction(drawModify.interactions)
// /* ****************** 修改网格 **************** */

/* ****************** 修改网格 **************** */

// const cluster = Tmap.ClusterPoint({ iconUrl: require('./car.png').default })

// a.forEach((item, index) => {
//   cluster.create({ id: index, point: item })
// })

// Tmap.addLayer(cluster.layer)
// Tmap.on('wheel', (e) => {
//   const t = cluster.wheel(e)
//   console.log('%c 🥜 t: ', 'font-size:20px;background-color: #FCA650;color:#fff;', t)
// })

