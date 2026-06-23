import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrambleTextPlugin)

ScrollSmoother.create({
  smooth: 1,
  effects: true,
  smoothTouch: 0.1,
})

const lenis = new Lenis({
  autoRaf: true,
})

lenis.on('scroll', ScrollTrigger.update)

window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.overflow = 'hidden'
})

/** @type {HTMLDivElement | null} */
const left = document.querySelector('#__portfolio .left')
/** @type {HTMLDivElement | null} */
const keyword = document.querySelector('#keyword')
/** @type {HTMLUListElement[]} */
const collections = gsap.utils.toArray('.collection')

function calculateCollectionsHeight(collections) {
  const height = collections.reduce((acc, collection) => acc + collection.clientHeight, 0)
  return height
}

ScrollTrigger.create({
  trigger: left,
  start: 'top top',
  end: () => `+=${calculateCollectionsHeight(collections)}`,
  // end: () => `bottom 50%`,
  pin: true,
  markers: false,
})

collections.forEach((collection) => {
  ScrollTrigger.create({
    trigger: collection,
    start: 'top center',
    end: 'bottom center',
    onEnter() {
      updateKeyword(collection.dataset.keyword)
    },
    onEnterBack() {
      updateKeyword(collection.dataset.keyword)
    },
  })
})

function updateKeyword(text) {
  if (keyword?.textContent === text) return

  gsap
    .timeline()
    .to(keyword, {
      opacity: 0,
      y: -40,
      duration: 0.2,
    })
    .set(keyword, {
      textContent: text,
      y: 40,
    })
    .to(keyword, {
      opacity: 1,
      y: 0,
      duration: 0.2,
    })
}

const split = SplitText.create('[data-animate-line]', { type: 'chars,words,lines' })

gsap.from(split.lines, {
  rotationY: -100,
  transformOrigin: '50% 50%',
  opacity: 0,
  duration: 1,
  ease: 'power3',
  stagger: 0.25,
  scrollTrigger: {
    trigger: '[data-animate-line]',
    start: 'top 80%',
    toggleActions: 'play none none none',
    once: true,
  },
})

const bar = document.getElementById('__scroll-progress')

const state = { progress: 0 }

gsap.to(state, {
  progress: 100,
  ease: 'bounce.out',
  scrollTrigger: {
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      bar && (bar.style.height = `${self.progress * 100}%`)
    },
  },
})

/** @type {HTMLElement[]} */
const scrambles = gsap.utils.toArray('[data-scramble]')

scrambles.forEach((link) => {
  const original = link.textContent

  const tl = gsap.timeline({ paused: true })

  tl.to(link, {
    duration: link.dataset.duration || 0.8,
    scrambleText: {
      text: link.dataset.scrambleText || original,
    },
  })

  link.addEventListener('mouseenter', () => tl.restart())
  link.addEventListener('mouseleave', () => {
    gsap.to(link, {
      duration: 0.6,
      scrambleText: {
        text: original,
      },
    })
  })
})
