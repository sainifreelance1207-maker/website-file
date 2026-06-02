import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenisInstance: Lenis | null = null

export function initLenis(options: { syncScrollTrigger?: boolean } = {}): Lenis {
  const lenis = new Lenis()

  if (options.syncScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  // Expose globally so other components can use it
  ;(window as any).lenis = lenis

  lenisInstance = lenis
  return lenis
}

export function getScrollY(): number {
  if (lenisInstance) {
    return lenisInstance.scroll
  }
  return window.scrollY
}
