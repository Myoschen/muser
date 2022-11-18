import AudioItem from '@renderer/components/AudioItem'
import useStore from '@renderer/store'

export default function AudioList(): JSX.Element {
  const AudioList = useStore((state) => state.audioList)
  const folderPath = useStore((state) => state.directory_path)

  return (
    <ul className="flex:1 w:full my:16 grid grid-template-cols:1fr grid-auto-rows:min-content overflow-y:auto scrollbar">
      {AudioList &&
        AudioList.map((audioName, index) => (
          <AudioItem key={`${folderPath}\\${audioName}`} index={index} audioName={audioName} />
        ))}
    </ul>
  )
}
