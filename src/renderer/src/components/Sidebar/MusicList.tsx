import { useAppSelector, selectMusic, useAppDispatch } from '@features/hooks'
import { setMusicId } from '@features/slices/player'
import MusicItem from './MusicItem'

function MusicList() {
  const { list } = useAppSelector(selectMusic)
  const dispatch = useAppDispatch()

  return (
    <ul className="flex:1 grid grid-template-cols:1fr grid-auto-rows:min-content overflow-y:auto scrollbar">
      {list &&
        list.map((music, index) => (
          <MusicItem
            key={music.src}
            name={music.name}
            onClick={() => dispatch(setMusicId(index))}
          />
        ))}
    </ul>
  )
}
export default MusicList
