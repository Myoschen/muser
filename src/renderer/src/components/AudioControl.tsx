import { useEffect, useMemo, useRef, useState } from 'react'
import el from '@master/style-element.react'
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
import Slider from '@renderer/components/Slider'
import useStore from '@renderer/store'
import { secondsToTime } from '@renderer/utils/time'

export default function AudioControl(): JSX.Element {
  const defaultVolume = useStore((state) => state.setting.defaultVolume)
  const directoryPath = useStore((state) => state.setting.directoryPath)
  const currentAudio = useStore((state) => state.currentAudio)
  const currentAudioName = useStore((state) => state.currentAudioName)
  const updateCurrentAudio = useStore((state) => state.updateCurrentAudio)

  const source = useMemo(
    () => `${directoryPath}\\${currentAudioName}`,
    [directoryPath, currentAudioName]
  )
  const audioRef = useRef<HTMLAudioElement>(null)
  const [status, setStatus] = useState({
    isPlaying: false,
    isLoaded: false
  })
  const [isDisplay, setIsDisplay] = useState(false)
  const [volume, setVolume] = useState(0)
  const [repeatType, setRepeatType] = useState<'off' | 'once' | 'all'>('off')
  const [timeDetail, setTimeDetail] = useState({
    current: 0,
    duration: 0
  })

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
  const handleDisplay = (): void => setIsDisplay(!isDisplay)

  useEffect(() => {
    setStatus({ ...status, isPlaying: true })
  }, [directoryPath, currentAudio])

  useEffect(() => {
    setVolume(defaultVolume)
  }, [defaultVolume])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  return (
    <>
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
        preload="auto"
      />
      <Container>
        <DurationContainer>
          <DurationText>00:00</DurationText>
          <DurationText className="o:1">
            {isNaN(timeDetail.duration) ? '00:00' : secondsToTime(timeDetail.duration)}
          </DurationText>
          <Slider
            styles="flex:1"
            max={timeDetail.duration || 0}
            value={timeDetail.current}
            onChange={handleDrag}
          />
        </DurationContainer>
        <Control>
          <div className="rel">
            <IconButton
              icon={volume === 0 ? <TbVolumeOff /> : <TbVolume />}
              onClick={handleDisplay}
              disabled={!status.isLoaded}
            />
            <div
              className={
                (isDisplay ? 'flex' : 'hide') +
                ' abs top:-80% left:50% h:32 p:8 r:4 b:1|solid|primary/.15 border-color:primary-dark/.15@dark bg:secondary bg:secondary-dark@dark transform-origin:left rotate(-90deg)'
              }
            >
              <Slider
                max={1.0}
                value={volume}
                onChange={handleVolume}
                step={0.01}
                styles="w:80px"
              />
            </div>
          </div>
          <IconButton
            icon={<TbPlayerTrackPrev />}
            onClick={handlePrev}
            disabled={!status.isLoaded}
          />
          <IconButton
            icon={status.isPlaying ? <TbPlayerPause /> : <TbPlayerPlay />}
            onClick={handlePlay}
            disabled={!status.isLoaded}
          />
          <IconButton
            icon={<TbPlayerTrackNext />}
            onClick={handleNext}
            disabled={!status.isLoaded}
          />
          <IconButton
            icon={
              repeatType === 'off' ? (
                <TbRepeatOff />
              ) : repeatType === 'once' ? (
                <TbRepeatOnce />
              ) : (
                <TbRepeat />
              )
            }
            onClick={handleRepeatType}
            disabled={!status.isLoaded}
          />
        </Control>
      </Container>
    </>
  )
}

const Container = el.div`
  flex:1
`

const DurationContainer = el.div`
  w:full
  p:24
  flex
  jc:space-between
  ai:center
  gap:16
`

const DurationText = el.span`
  f:14
  ls:2
  color:primary
  color:primary-dark@dark
`

const Control = el.div`
  mt:12
  flex
  jc:center
  gap:24
`
