import { TbChartCandle, TbFolder } from 'react-icons/tb'
import Divider from '@renderer/components/Divider'
import TrackList from '@renderer/components/TrackList'
import { useAppConfig, useTrackDetail } from '@renderer/store'

export default function Sidebar(): JSX.Element {
  const folderPath = useAppConfig((state) => state.directory_path)
  const updateConfig = useAppConfig((state) => state.updateConfig)
  const updateTrackList = useTrackDetail((state) => state.updateTrackList)
  const updateCurrentTrack = useTrackDetail((state) => state.updateCurrentTrack)

  const handleSelectFolder = async (): Promise<void> => {
    const result = await window.api.readDirectory()
    if (result === undefined) {
      new Notification('Muser', { body: 'You must select a folder!' })
    } else {
      updateConfig({ directory_path: result[0] })
      updateTrackList(result[1])
      updateCurrentTrack(0)
    }
  }
  return (
    <div className="p:16 flex flex:col br:1|solid|black/.05 overflow:auto">
      <div className="drag-region:drag flex jc:space-between ai:center bg:white">
        <button
          className="drag-region:no-drag p:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms"
          onClick={handleSelectFolder}
        >
          <TbFolder />
        </button>
        <button className="drag-region:no-drag p:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms">
          <TbChartCandle />
        </button>
      </div>
      <Divider />
      <TrackList />
      <p className="f:12 f:light ls:2 t:center">{folderPath || 'Please select a folder.'}</p>
    </div>
  )
}
