import { AnimatePresence, motion } from 'framer-motion'
import { ChangeEventHandler, ReactEventHandler, useRef, useEffect } from 'react'
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconRepeat,
  IconRepeatOff,
  IconRepeatOnce,
  IconVolume,
  IconVolumeOff
} from '@tabler/icons-react'
import useClickAway from '@hooks/use-click-away'
import { secondsToMinutes } from '@utils/time'
import Button from '../common/Button'
import Slider from '../common/Slider'
import useToggle from '@hooks/use-toggle'
import {
  useAppDispatch,
  useAppSelector,
  selectPlayer,
  selectMusic,
  selectConfiguration
} from '@features/hooks'
import {
  setCurrentLocation,
  setDuration,
  setMusicId,
  setPlayerStatus,
  setVolume,
  setRepeatType
} from '@features/slices/player'

function MusicControl() {
  const { configuration } = useAppSelector(selectConfiguration)
  const { list } = useAppSelector(selectMusic)
  const { musicId, status, volume, duration, currentLocation, repeatType } =
    useAppSelector(selectPlayer)
  const dispatch = useAppDispatch()

  const volumePopupRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPopupOpen, handleIsPopupOpen] = useToggle()

  // Next Song
  // 下一首
  const handleNext = () => {
    const nextId = (musicId + 1) % list.length
    dispatch(setMusicId(nextId))
  }

  // Previous Song
  // 上一首
  const handlePrev = () => {
    const prevId = musicId - 1 < 0 ? list.length - 1 : (musicId - 1) % list.length
    dispatch(setMusicId(prevId))
  }

  // Control play or pause
  // 控制播放或暫停
  const handlePlay = () => {
    if (!audioRef.current) return
    if (status === 'stop') {
      audioRef.current.play()
      dispatch(setPlayerStatus('playing'))
    } else {
      audioRef.current.pause()
      dispatch(setPlayerStatus('stop'))
    }
  }

  // Control volume
  // 控制音量
  const handleVolume: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!audioRef.current) return
    const volume = parseFloat(e.target.value)
    audioRef.current.volume = volume
    dispatch(setVolume(parseFloat(e.target.value)))
  }

  // Control repeat type: off, once, all
  // 控制重播類型：關閉、單曲、全部
  const handleRepeatType = () => {
    dispatch(setRepeatType())
  }

  // When music loaded
  // 當音樂載入完成
  const handleMetadataLoaded: ReactEventHandler<HTMLAudioElement> = () => {
    if (!audioRef.current) return
    dispatch(setDuration(audioRef.current.duration))
    audioRef.current.volume = volume
  }

  // Control current location of the music
  // 控制音樂當前進度
  const handleTimeSeek: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!audioRef.current) return
    if (status === 'playing') {
      audioRef.current.pause()
    }
    const current = parseFloat(e.target.value)
    audioRef.current.currentTime = current
    dispatch(setCurrentLocation(current))
  }

  const handleTimeSeekEnd = () => {
    if (!audioRef.current) return
    if (status === 'playing') {
      audioRef.current.play()
    }
  }

  // When time update
  // 當音樂更新進度
  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    dispatch(setCurrentLocation(audioRef.current.currentTime))
  }

  // When music ended
  // 當音樂結束
  const handleEnded = () => {
    if (repeatType === 'off') {
      dispatch(setPlayerStatus('stop'))
      dispatch(setCurrentLocation(0))
    } else if (repeatType === 'all') {
      handleNext()
    }
  }

  useClickAway(volumePopupRef, () => handleIsPopupOpen(false))

  // when repeat all is on and the audio changes
  useEffect(() => {
    if (!audioRef.current) return
    if (repeatType === 'all') {
      audioRef.current.play()
      dispatch(setPlayerStatus('playing'))
    }
  }, [musicId, repeatType])

  // when switching directory stop audio
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    dispatch(setPlayerStatus('stop'))
  }, [configuration.directory])

  return (
    <div className="flex:1">
      <audio
        ref={audioRef}
        src={list[musicId] ? list[musicId].src : undefined}
        preload="auto"
        onLoadedMetadata={handleMetadataLoaded}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        loop={repeatType === 'once'}
        hidden
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
      <div className="w:full p:24 grid grid-template-cols:1fr|8fr|1fr ji:center gap:16">
        <span className="f:14 ls:2 color:primary color:primary-dark@dark">
          {isNaN(currentLocation) ? '00:00' : secondsToMinutes(currentLocation)}
        </span>
        <Slider
          styles="js:stretch"
          max={duration || 0}
          value={currentLocation}
          onChange={handleTimeSeek}
          onMouseUp={handleTimeSeekEnd}
          disabled={list.length === 0}
        />
        <span className="f:14 ls:2 color:primary color:primary-dark@dark">
          {isNaN(duration) ? '00:00' : secondsToMinutes(duration)}
        </span>
      </div>
      <div className="mt:12 flex jc:center gap:24">
        <div ref={volumePopupRef} className="rel">
          <Button
            icon={volume === 0 ? <IconVolumeOff size={16} /> : <IconVolume size={16} />}
            onClick={() => handleIsPopupOpen()}
            disabled={list.length === 0}
          />
          <AnimatePresence mode="wait">
            {isPopupOpen && (
              <motion.div
                className="abs flex top:50% left:50% h:32 p:8 r:4 b:1|solid|primary/.15 border-color:primary-dark/.15@dark bg:secondary bg:secondary-dark@dark transform-origin:left"
                initial={{ y: -30, opacity: 0, rotate: -90 }}
                animate={{ y: -40, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Slider
                  max={1.0}
                  value={volume}
                  onChange={handleVolume}
                  step={0.01}
                  styles="w:80px"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button
          icon={<IconPlayerSkipBack size={16} />}
          onClick={handlePrev}
          disabled={list.length === 0}
        />
        <Button
          icon={status === 'playing' ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
          onClick={handlePlay}
          disabled={list.length === 0}
        />
        <Button
          icon={<IconPlayerSkipForward size={16} />}
          onClick={handleNext}
          disabled={list.length === 0}
        />
        <Button
          icon={
            repeatType === 'off' ? (
              <IconRepeatOff size={16} />
            ) : repeatType === 'once' ? (
              <IconRepeatOnce size={16} />
            ) : (
              <IconRepeat size={16} />
            )
          }
          onClick={handleRepeatType}
          disabled={list.length === 0}
        />
      </div>
    </div>
  )
}

export default MusicControl
