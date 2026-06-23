class Copyright extends HTMLElement {
  #from = 'No from provided'
  #name = 'No name provided'

  static get observedAttributes() {
    return ['name', 'from']
  }

  constructor() {
    super()
  }

  connectedCallback() {
    this.#from = this.getAttribute('from') || this.#from
    this.#name = this.getAttribute('name') || this.#name

    let period = ''
    if (+this.#from < new Date().getFullYear()) {
      period = `${this.#from}-PRESENT`
    } else {
      period = `${this.#from}`
    }

    this.classList.add(...'text-sm'.split(' '))
    this.innerHTML = `${period} &copy; ${this.#name}`
  }
}

window.customElements.define('j-copyright', Copyright)
