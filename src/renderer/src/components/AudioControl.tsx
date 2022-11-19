import { useEffect, useMemo, useRef, useState } from 'react'
import {
  TbPlayerPause,
  TbPlayerPlay,
  TbPlayerTrackNext,
  TbPlayerTrackPrev,
  TbRepeat,
  TbRepeatOff,
  TbRepeatOnce,
  TbVolume,
  TbVolumeOff
} from 'react-icons/tb'
import IconButton from '@renderer/components/IconButton'
import ProgressBar from '@renderer/components/ProgressBar'
import useStore from '@renderer/store'
import { secondsToTime } from '@renderer/utils/time'

export default function Control(): JSX.Element {
  // Global State
  const directoryPath = useStore((state) => state.setting.directoryPath)
  const currentAudio = useStore((state) => state.currentAudio)
  const currentAudioName = useStore((state) => state.currentAudioName)
  const updateCurrentAudio = useStore((state) => state.updateCurrentAudio)

  // State
  const source = useMemo(
    () => `${directoryPath}\\${currentAudioName}`,
    [directoryPath, currentAudioName]
  )
  const audioRef = useRef<HTMLAudioElement>(null)
  const [status, setStatus] = useState({
    isPlaying: false,
    isLoaded: false,
    isMuted: false
  })
  const [isDisplay, setIsDisplay] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [repeatType, setRepeatType] = useState<'off' | 'once' | 'all'>('off')
  const [timeDetail, setTimeDetail] = useState({
    current: 0,
    duration: 0
  })

  // Handler
  const handleUpdateTime = (): void => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const duration = audioRef.current.duration
      setTimeDetail({ ...timeDetail, current, duration })
    }
  }
  const handlePlay = (): void => {
    if (audioRef.current) {
      status.isPlaying ? audioRef.current.pause() : audioRef.current.play()
      setStatus({ ...status, isPlaying: !status.isPlaying })
    }
  }
  const handleNext = (): void => updateCurrentAudio(currentAudio! + 1)
  const handlePrev = (): void => updateCurrentAudio(currentAudio! - 1)
  const handleDrag = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (audioRef.current) {
      const current = Number(e.target.value)
      audioRef.current.currentTime = current
      setTimeDetail({ ...timeDetail, current })
    }
  }
  const handleEnded = (): void => {
    if (audioRef.current) {
      setTimeDetail({ ...timeDetail, current: 0 })
      switch (repeatType) {
        case 'all':
          updateCurrentAudio(currentAudio! + 1)
          break
        default:
          audioRef.current.currentTime = 0
          setStatus({ ...status, isPlaying: false })
          break
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
  const handleLoaded = (): void => setStatus({ ...status, isLoaded: true })
  const handleError = (): void => setStatus({ ...status, isLoaded: false })
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setVolume(Number(e.target.value))
  const handleMuted = (): void => setStatus({ ...status, isMuted: !status.isMuted })

  useEffect(() => {
    setStatus({ ...status, isPlaying: true })
  }, [directoryPath, currentAudio])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  return (
    <>
      <div className="flex:1">
        <div className="w:full p:24 flex jc:space-between ai:center gap:16">
          <span className="f:14 ls:2 color:#404348">00:00</span>
          <ProgressBar
            styles="flex:1"
            max={timeDetail.duration || 0}
            value={timeDetail.current}
            onChange={handleDrag}
          />
          <span className="f:14 ls:2 color:#404348">
            {isNaN(timeDetail.duration) ? '00:00' : secondsToTime(timeDetail.duration)}
          </span>
        </div>
        <div className="mt:12 flex jc:center gap:24">
          <div
            className="rel"
            onMouseEnter={(): void => setIsDisplay(true)}
            onMouseLeave={(): void => setIsDisplay(false)}
          >
            <IconButton onClick={handleMuted} disabled={!status.isLoaded}>
              {status.isMuted || volume === 0 ? <TbVolumeOff /> : <TbVolume />}
            </IconButton>
            <div
              className={`abs top:-50% left:50% h:32 p:8 r:4 shadow:0|1|4|black/.1 transform-origin:left rotate(-90deg) bg:white ${
                isDisplay ? 'flex' : 'hide'
              }`}
            >
              <ProgressBar
                max={1.0}
                value={volume}
                onChange={handleVolume}
                step={0.1}
                styles="w:80px"
              />
            </div>
          </div>
          <IconButton onClick={handlePrev} disabled={!status.isLoaded}>
            <TbPlayerTrackPrev />
          </IconButton>
          <IconButton onClick={handlePlay} disabled={!status.isLoaded}>
            {status.isPlaying ? <TbPlayerPause /> : <TbPlayerPlay />}
          </IconButton>
          <IconButton onClick={handleNext} disabled={!status.isLoaded}>
            <TbPlayerTrackNext />
          </IconButton>
          <IconButton onClick={handleRepeatType} disabled={!status.isLoaded}>
            {repeatType === 'off' ? (
              <TbRepeatOff />
            ) : repeatType === 'once' ? (
              <TbRepeatOnce />
            ) : (
              <TbRepeat />
            )}
          </IconButton>
        </div>
      </div>
      <audio
        onLoadedMetadata={handleUpdateTime}
        onTimeUpdate={handleUpdateTime}
        onEnded={handleEnded}
        onLoadedData={handleLoaded}
        onError={handleError}
        src={source}
        ref={audioRef}
        autoPlay={true}
        loop={repeatType === 'once'}
        muted={status.isMuted}
        preload="auto"
      ></audio>
    </>
  )
}
