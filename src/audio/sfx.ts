/**
 * Arrow shot sound effect.
 *
 * ARROW_SFX_DELAY_MS can be tuned to sync the woosh with the zoom
 * animation without touching any other code.
 */

/** Delay (ms) before the arrow SFX plays after the shot is fired. */
export const ARROW_SFX_DELAY_MS = 0

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

/** Play the arrow woosh SFX, respecting the configurable delay. */
export function playArrowSfx() {
  const play = () => {
    if (!audioCtx) audioCtx = new AudioContext()
    loadBuffer().then(buffer => {
      const source = audioCtx!.createBufferSource()
      source.buffer = buffer
      source.connect(audioCtx!.destination)
      source.start()
    }).catch(() => {})
  }

  if (ARROW_SFX_DELAY_MS > 0) {
    setTimeout(play, ARROW_SFX_DELAY_MS)
  } else {
    play()
  }
}
