import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

ScrollSmoother.create({
  smooth: 1,
  effects: true,
  smoothTouch: 0.1,
})

new Lenis({
  autoRaf: true,
})

/** @type {HTMLDivElement | null} */
const left = document.querySelector('#__portfolio .left')
/** @type {HTMLDivElement | null} */
const keyword = document.querySelector('#keyword')
/** @type {HTMLUListElement[]} */
const collections = gsap.utils.toArray('.collection')

function calculateCollectionsHeight(collections) {
  const height = collections.reduce((acc, collection) => acc + collection.clientHeight, 0)
  console.log(height)
  return height
}

ScrollTrigger.create({
  trigger: left,
  start: 'top top',
  end: () => `+=${calculateCollectionsHeight(collections)}`,
  // end: () => `bottom 50%`,
  pin: true,
  markers: true,
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
