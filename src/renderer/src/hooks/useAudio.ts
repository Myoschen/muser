import { useEffect, useRef, useState } from 'react'

type useAudioReturnType = [
  (src: string) => void,
  boolean,
  () => void,
  number,
  (volume: number) => void
]

const useAudio = (src: string): useAudioReturnType => {
  const audio = useRef(new Audio(src))
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)

  const handleAudio = (src: string): void => {
    audio.current.pause()
    audio.current.src = src
  }
  const handlePlay = (): void => setPlaying(!playing)
  const handleVolume = (volume: number): void => setVolume(volume)

  useEffect(() => {
    audio.current.volume = volume
  }, [volume])

  useEffect(() => {
    playing ? audio.current.play() : audio.current.pause()
  }, [playing])

  useEffect(() => {
    audio.current.addEventListener('ended', () => setPlaying(false))
    return () => {
      audio.current.removeEventListener('ended', () => setPlaying(false))
    }
  }, [])

  return [handleAudio, playing, handlePlay, volume, handleVolume]
}

export default useAudio
