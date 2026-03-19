// High-performance Audio Service using Web Audio API
// This avoids the need for external MP3 files and provides zero-latency feedback.

const AUDIO_ENABLED_KEY = 'voxa_sound_enabled'

let audioCtx = null

const initContext = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioCtx
}

const isEnabled = () => {
    const saved = localStorage.getItem(AUDIO_ENABLED_KEY)
    return saved === null || saved === 'true'
}

const playTone = (freq, type, duration, volume = 0.1) => {
    if (!isEnabled()) return

    const ctx = initContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime)
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start()
    oscillator.stop(ctx.currentTime + duration)
}

export const playSuccessSound = () => {
    playTone(880, 'sine', 0.1, 0.05)
    setTimeout(() => playTone(1108, 'sine', 0.2, 0.03), 50)
}

export const playErrorSound = () => {
    playTone(150, 'triangle', 0.3, 0.1)
}

export const playListeningStart = () => {
    // A soft, uplifting upward sweep
    playTone(440, 'sine', 0.1, 0.05)
    setTimeout(() => playTone(554, 'sine', 0.1, 0.05), 60)
}

export const toggleSoundSettings = (enabled) => {
    localStorage.setItem(AUDIO_ENABLED_KEY, enabled)
}

export const getSoundSettings = () => isEnabled()
