
export class SVGEnvironment {

  static setDefaultEnvironment(selector) {
    this.default = new SVGEnvironment(selector)
  }

  constructor(selector) {
    this.svg = document.querySelector(selector)
  }

  screenToUser({ x, y }) {
    const svgPoint = this.svg.createSVGPoint()
    svgPoint.x = x
    svgPoint.y = y
    const userPos = svgPoint.matrixTransform(this.svg.getScreenCTM().inverse())
    return userPos
  }
}
