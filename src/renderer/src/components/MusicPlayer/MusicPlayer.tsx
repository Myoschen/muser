import MuserIcon from '@renderer/assets/icon.png'
import { selectMusic, selectPlayer, useAppSelector } from '@renderer/features/hooks'
import MusicControl from './MusicControl'

function MusicPlayer() {
  const { list } = useAppSelector(selectMusic)
  const { musicId } = useAppSelector(selectPlayer)
  const music = list[musicId] // Maybe undefined

  return (
    <div className="flex flex:col bg:secondary bg:secondary-dark@dark ~background-color|150ms|ease-in-out">
      {/* Title 標題 */}
      <div className="drag-region:drag rel flex jc:space-between ai:center">
        <h1 className="flex:1 p:24 f:20 f:medium t:center ls:2 color:primary color:primary-dark@dark">
          {music ? music.name : 'Muser - A Simple Music Player'}
        </h1>
      </div>

      {/* Image 圖片 */}
      <div className="flex:3 flex jc:center ai:center">
        <img
          className="w:320 hue-rotate(0) hue-rotate(135)@dark"
          src={MuserIcon}
          alt="music-list-image"
        />
      </div>

      {/* Music Controller 音樂控制器 */}
      <MusicControl />
    </div>
  )
}

export default MusicPlayer
