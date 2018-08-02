
import { Binding } from './core/binding.js'
import { Draggable } from './core/draggable.js'
import { SVGEnvironment } from './core/svg-environment.js'

function main () {
  console.log('initialized')
  SVGEnvironment.setDefaultEnvironment('svg')
  const slider = document.querySelector('#slider')
  const handle = new Draggable('#handle', {
    xAttribute: 'cx',
    xClamp: slider,
  })
  const binding = new Binding('#handle', {
    attributeDidChange: ({ attributeName, newValue }) => {
      if (attributeName === 'cx') {
        const cx = newValue.baseVal.value
        const ratio = (cx - 10) / 80
        setWaveShape(ratio)
      }
    }
  })

}

function setWaveShape(ratio) {
  const wave = document.querySelector('#wave')
  const controlPoint1 = document.querySelector('#control-point-1')
  const controlPoint2 = document.querySelector('#control-point-2')

  // Set the wave
  const dxMax = 50
  const x1 = 0 + ratio * dxMax
  const x2 = 100 - ratio * dxMax
  const d = `M0 50 Q ${x1} 0 50 50 T 100 50`
  wave.setAttribute('d', d)

  // Set control points
  controlPoint1.setAttribute('cx', x1)
  controlPoint2.setAttribute('cx', x2)
}

document.addEventListener('DOMContentLoaded', main)
