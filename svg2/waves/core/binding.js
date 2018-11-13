
import { SVGEnvironment } from './svg-environment.js'

export class Binding {

  constructor(selector, options = {}) {
    this.env                = options.env || SVGEnvironment.default
    this.attributeDidChange = options.attributeDidChange
    this.element = document.querySelector(selector)
    this.observer = new MutationObserver(this.didMutate.bind(this))
    this.observerOptions = { attributes: true }
    this.connect()
  }

  connect() {
    this.observer.observe(this.element, this.observerOptions)
  }

  dicconnect() {
    this.observer.disconnect()
  }

  didMutate (mutationList, observer) {
    mutationList.forEach((mutation) => {
      switch (mutation.type) {
        case 'attributes': {
          const { attributeName, target } = mutation
          const newValue = target[attributeName]
          if (this.attributeDidChange) {
            this.attributeDidChange({ attributeName, newValue })
          }
          break
        }
        default:
          console.warn('Unsupported mutation', { mutation })
          break
      }
    })
  }
}
