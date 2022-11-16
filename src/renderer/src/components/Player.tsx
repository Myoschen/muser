import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  TbPlayerPlay,
  TbPlayerPause,
  TbPlayerTrackNext,
  TbPlayerTrackPrev,
  TbX,
  TbRepeatOff,
  TbRepeat,
  TbRepeatOnce,
  TbVolume,
  TbVolumeOff
} from 'react-icons/tb'
import { useAppConfig, useTrackDetail } from '@renderer/store'
import { secondsToTime } from '@renderer/utils/time'

export default function Player(): JSX.Element {
  // Global State
  const folderPath = useAppConfig((state) => state.directory_path)
  const currentTrack = useTrackDetail((state) => state.currentTrack)
  const currentTrackName = useTrackDetail((state) => state.currentTrackName)
  const updateCurrentTrack = useTrackDetail((state) => state.updateCurrentTrack)

  // State
  const trackSource = useMemo(
    () => `${folderPath}\\${currentTrackName}`,
    [folderPath, currentTrackName]
  )
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [repeatType, setRepeatType] = useState<'off' | 'once' | 'all'>('off')
  const [trackInfo, setTrackInfo] = useState<{ current: number; duration: number }>({
    current: 0,
    duration: 0
  })

  // Handler
  const handleClose = async (): Promise<void> => await window.api.closeApp()
  const handleUpdateTime = (): void => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const duration = audioRef.current.duration
      setTrackInfo({ ...trackInfo, current, duration })
    }
  }
  const handlePlay = (): void => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(!isPlaying)
      } else {
        audioRef.current.play()
        setIsPlaying(!isPlaying)
      }
    }
  }
  const handleDrag = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (audioRef.current) {
      const current = Number(e.target.value)
      audioRef.current.currentTime = current
      setTrackInfo({ ...trackInfo, current })
    }
  }
  const handleTrack = (action: 'next' | 'prev'): void => {
    if (currentTrack) {
      if (action === 'next') updateCurrentTrack(currentTrack + 1)
      else if (action === 'prev') updateCurrentTrack(currentTrack - 1)
    }
  }
  const handleEnded = (): void => {
    if (audioRef.current) {
      setTrackInfo({ ...trackInfo, current: 0 })
      if (repeatType === 'once') {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      } else if (repeatType === 'all') {
        updateCurrentTrack(currentTrack! + 1)
        audioRef.current.play()
      } else {
        audioRef.current.currentTime = 0
        setIsPlaying(!isPlaying)
      }
    }
  }
  const handleRepeatType = (): void => {
    switch (repeatType) {
      case 'off':
        setRepeatType('once')
        break
      case 'once':
        setRepeatType('all')
        break
      case 'all':
        setRepeatType('off')
        break
    }
  }

  return (
    <>
      <audio
        onLoadedMetadata={handleUpdateTime}
        onTimeUpdate={handleUpdateTime}
        onEnded={handleEnded}
        src={trackSource}
        ref={audioRef}
      ></audio>
      <div className="flex flex:col bg:black/.02">
        <div className="drag-region:drag rel flex jc:space-between ai:center">
          <p className="flex:1 p:24 f:20 t:center ls:2">
            {currentTrackName ? currentTrackName.split('.')[0] : 'Muser - A Simple Music Player.'}
          </p>
          <button
            className="drag-region:no-drag abs top:16 right:16 p:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms"
            onClick={handleClose}
          >
            <TbX />
          </button>
        </div>
        <div className="flex:3 flex jc:center ai:center">
          <img
            className="w:320 drop-shadow(0|5|20|black/.2)"
            src="file://C:\Users\willy\Desktop\App\electron\muser\build\icon.png"
            alt="music-list-image"
          />
        </div>
        <div className="flex:1">
          <div className="w:full p:24 flex jc:space-between ai:center gap:16">
            <span className="f:14 ls:2">00:00</span>
            <input
              className="appearance:none flex:1 {appearance:none;rel;top:-50%;w:8;h:8;r:50%;bg:gray-80;~background-color|150ms|ease-in}::slider-thumb bg:gray-60::slider-thumb:hover {h:4;r:8;bg:black/.05}::slider-runnable-track"
              value={trackInfo.current}
              min={0}
              max={trackInfo.duration || 0}
              onChange={handleDrag}
              type="range"
            />
            <span className="f:14 ls:2">
              {trackInfo.duration && secondsToTime(trackInfo.duration)}
            </span>
          </div>
          <div className="mt:12 flex jc:center gap:24">
            <button className="p:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms">
              <TbVolume />
            </button>
            <button
              className="p:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms"
              onClick={(): void => handleTrack('prev')}
            >
              <TbPlayerTrackPrev />
            </button>
            <button
              className="p:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms"
              onClick={handlePlay}
            >
              {isPlaying ? <TbPlayerPause /> : <TbPlayerPlay />}
            </button>
            <button
              className="p:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms"
              onClick={(): void => handleTrack('next')}
            >
              <TbPlayerTrackNext />
            </button>
            <button
              className="p:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms"
              onClick={handleRepeatType}
            >
              {repeatType === 'off' ? (
                <TbRepeatOff />
              ) : repeatType === 'once' ? (
                <TbRepeatOnce />
              ) : (
                <TbRepeat />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
