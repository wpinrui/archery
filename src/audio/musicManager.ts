/**
 * Singleton background-music playlist manager.
 *
 * Plays a fixed list of tracks in order, looping back to the first track
 * after the last one finishes. Exposes stop / advance-and-play controls
 * so screens can pause during gameplay and resume from the next track.
 */

const PLAYLIST = [
  '/music/morning2 Carpe Diem.mp3',
  '/music/afternoon3 Groundwork.mp3',
  '/music/afternoon4 Midday Dance.mp3',
  '/music/evening2 Fretless.mp3',
  '/music/evening3 Fuzzball Parade.mp3',
]

let audio: HTMLAudioElement | null = null
let currentIndex = 0

function ensureAudio() {
  if (audio) return audio
  audio = new Audio()
  audio.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % PLAYLIST.length
    audio!.src = PLAYLIST[currentIndex]
    audio!.play().catch(() => {})
  })
  return audio
}

/** Start (or resume) playback of the current track. */
export function playMusic() {
  const a = ensureAudio()
  if (!a.paused) return
  if (!a.src || a.src === location.origin + '/') {
    a.src = PLAYLIST[currentIndex]
  }
  a.play().catch(() => {})
}

/** Stop playback entirely (does not reset position — but advanceAndPlay
 *  will start the *next* track from 0 anyway). */
export function stopMusic() {
  if (!audio) return
  audio.pause()
}

/** Advance to the next track and begin playing from the start. */
export function advanceAndPlay() {
  const a = ensureAudio()
  currentIndex = (currentIndex + 1) % PLAYLIST.length
  a.src = PLAYLIST[currentIndex]
  a.currentTime = 0
  a.play().catch(() => {})
}
