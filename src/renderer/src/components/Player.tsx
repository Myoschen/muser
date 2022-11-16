import { useEffect } from 'react'
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
import useAudio from '@renderer/hooks/useAudio'
import { useAppConfig, useTrackDetail } from '@renderer/store'

export default function Player(): JSX.Element {
  const folderPath = useAppConfig((state) => state.directory_path)
  const currentTrack = useTrackDetail((state) => state.currentTrack)
  const currentTrackName = useTrackDetail((state) => state.currentTrackName)
  const updateCurrentTrack = useTrackDetail((state) => state.updateCurrentTrack)
  const trackSrc = `${folderPath}\\${currentTrackName}`
  const [handleAudio, playing, handlePlay] = useAudio(trackSrc)

  const handleClose = async (): Promise<void> => await window.api.closeApp()

  useEffect(() => {
    handleAudio(trackSrc)
  }, [trackSrc])

  return (
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
            className="appearance:none flex:1 {appearance:none;rel;top:-50%;w:8;h:8;r:50%;bg:gray-60}::slider-thumb {h:4;r:8;bg:black/.05}::slider-runnable-track"
            defaultValue={0}
            type="range"
          />
          <span className="f:14 ls:2">04:06</span>
        </div>
        <div className="mt:12 flex jc:center gap:24">
          <button className="p:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms">
            <TbVolume />
          </button>
          <button
            className="p:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms"
            onClick={(): void => updateCurrentTrack(currentTrack! - 1)}
          >
            <TbPlayerTrackPrev />
          </button>
          <button
            className="p:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms"
            onClick={handlePlay}
          >
            {playing ? <TbPlayerPause /> : <TbPlayerPlay />}
          </button>
          <button
            className="p:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms"
            onClick={(): void => updateCurrentTrack(currentTrack! + 1)}
          >
            <TbPlayerTrackNext />
          </button>
          <button className="p:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms">
            <TbRepeat />
          </button>
        </div>
      </div>
    </div>
  )
}
