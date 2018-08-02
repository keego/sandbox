
import { SVGEnvironment } from './svg-environment.js'

export class Draggable {

  constructor(selector, options = {}) {
    this.env = options.env || SVGEnvironment.default
    this.xAttribute = options.xAttribute
    this.yAttribute = options.yAttribute
    this.xClamp = options.xClamp && options.xClamp.getAttribute
      ? {
        min: options.xClamp.getAttribute('x1'),
        max: options.xClamp.getAttribute('x2'),
      }
      : options.xClamp
    this.yClamp = options.yClamp && options.yClamp.getAttribute
      ? {
        min: options.yClamp.getAttribute('y1'),
        max: options.yClamp.getAttribute('y2'),
      }
      : options.yClamp
    this.el = document.querySelector(selector)
    this.el.addEventListener('mousedown', this.dragStart.bind(this))
    document.addEventListener('mousemove', this.dragMove.bind(this))
    document.addEventListener('mouseup', this.dragEnd.bind(this))
  }

  dragStart(event) {
    this.dragging = true
    this.mouseStartedAt = this.getMousePos(event)
    this.elStartedAt = this.getElPos(event)
  }

  dragMove(event) {
    if (this.dragging) {
      const mouseScreenPos = this.getMousePos(event)
      const mouseUserPos = this.env.screenToUser(mouseScreenPos)
      if (this.xAttribute) {
        const newElX = this.xClamp
          ? Math.max(this.xClamp.min, Math.min(mouseUserPos.x, this.xClamp.max))
          : mouseUserPos.x
        this.el.setAttribute(this.xAttribute, newElX)
      }
      if (this.yAttribute) {
        const newElY = this.yClamp
          ? Math.max(this.yClamp.min, Math.min(mouseUserPos.y, this.yClamp.max))
          : mouseUserPos.y
        this.el.setAttribute(this.yAttribute, newElY)
      }
    }
  }

  dragEnd() {
    this.dragging = false
  }

  getMousePos(event) {
    const pos = {
      x: event.clientX,
      y: event.clientY,
    }
    return pos
  }

  getElPos() {
    const pos = {
      x: this.xAttribute
        ? parseInt(this.el.getAttribute(this.xAttribute))
        : 0,
      y: this.yAttribute
        ? parseInt(this.el.getAttribute(this.yAttribute))
        : 0,
    }
    return pos
  }
}
