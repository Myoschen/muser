import el from '@master/style-element.react'
import AudioItem from '@renderer/components/AudioItem'
import useStore from '@renderer/store'

export default function AudioList(): JSX.Element {
  const AudioList = useStore((state) => state.audioList)
  const directoryPath = useStore((state) => state.setting.directoryPath)

  return (
    <List>
      {AudioList &&
        AudioList.map((audio, index) => (
          <AudioItem key={`${directoryPath}\\${audio}`} index={index} audio={audio} />
        ))}
    </List>
  )
}

const List = el.ul`
  flex:1
  my:16
  grid
  grid-template-cols:1fr
  grid-auto-rows:min-content
  overflow-y:auto
  scrollbar
`
