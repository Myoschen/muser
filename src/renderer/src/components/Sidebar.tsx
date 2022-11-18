import { TbChartCandle, TbFolder } from 'react-icons/tb'
import IconButton from '@renderer/components/IconButton'
import Divider from '@renderer/components/Divider'
import AudioList from '@renderer/components/AudioList'
import useStore from '@renderer/store'

export default function Sidebar(): JSX.Element {
  const folderPath = useStore((state) => state.directory_path)
  const updateConfig = useStore((state) => state.updateConfig)
  const updateAudioList = useStore((state) => state.updateAudioList)
  const updateCurrentAudio = useStore((state) => state.updateCurrentAudio)

  const handleSelectFolder = async (): Promise<void> => {
    const result = await window.api.readDirectory()
    if (result === undefined) {
      new Notification('Muser', { body: 'You must select a folder!' })
    } else {
      updateConfig({ directory_path: result[0] })
      updateAudioList(result[1])
      updateCurrentAudio(0)
    }
  }
  return (
    <div className="p:16 flex flex:col br:1|solid|black/.05 overflow:auto">
      <div className="drag-region:drag flex jc:space-between ai:center bg:white">
        <IconButton onClick={handleSelectFolder}>
          <TbFolder />
        </IconButton>
        <IconButton onClick={(): void => {}}>
          <TbChartCandle />
        </IconButton>
      </div>
      <Divider />
      <AudioList />
      <p className="f:12 f:light ls:2 t:center">{folderPath || 'Please select a folder.'}</p>
    </div>
  )
}
