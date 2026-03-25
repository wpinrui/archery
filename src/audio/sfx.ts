/**
 * Arrow shot sound effect.
 *
 * ARROW_SFX_DELAY_MS maps each distance to a delay so the woosh
 * aligns with the zoom-to-impact animation. Tune these values
 * without touching any other code.
 */

import type { Distance } from '../types'

/** Per-distance delay (ms) before the arrow SFX plays. */
export const ARROW_SFX_DELAY_MS: Record<Distance, number> = {
  18: 0,
  30: 140,
  50: 428,
  70: 774,
  90: 1188,
}

const SFX_PATH = '/sfx/72208__strangely_gnarled__arrow_woosh__twang_01.wav'

let sfxBuffer: AudioBuffer | null = null
let audioCtx: AudioContext | null = null

async function loadBuffer() {
  if (sfxBuffer) return sfxBuffer
  if (!audioCtx) audioCtx = new AudioContext()
  const resp = await fetch(SFX_PATH)
  const buf = await resp.arrayBuffer()
  sfxBuffer = await audioCtx.decodeAudioData(buf)
  return sfxBuffer
}

/** Pre-load the SFX so the first shot has no fetch latency. */
export function preloadArrowSfx() {
  loadBuffer().catch(() => {})
}

/** Play the arrow woosh SFX, respecting the per-distance delay. */
export function playArrowSfx(distance: Distance) {
  const play = () => {
    if (!audioCtx) audioCtx = new AudioContext()
    loadBuffer().then(buffer => {
      const source = audioCtx!.createBufferSource()
      source.buffer = buffer
      source.connect(audioCtx!.destination)
      source.start()
    }).catch(() => {})
  }

  const delay = ARROW_SFX_DELAY_MS[distance] ?? 0
  if (delay > 0) {
    setTimeout(play, delay)
  } else {
    play()
  }
}
