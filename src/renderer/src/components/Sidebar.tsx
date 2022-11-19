import { TbChartCandle, TbFolder } from 'react-icons/tb'
import IconButton from '@renderer/components/IconButton'
import Divider from '@renderer/components/Divider'
import AudioList from '@renderer/components/AudioList'
import useStore from '@renderer/store'
import SettingModal from './SettingModal'
import { useState } from 'react'

export default function Sidebar(): JSX.Element {
  const directoryPath = useStore((state) => state.setting.directoryPath)
  const updateSetting = useStore((state) => state.updateSetting)
  const updateAudioList = useStore((state) => state.updateAudioList)
  const updateCurrentAudio = useStore((state) => state.updateCurrentAudio)

  const [isOpen, setIsOpen] = useState(false)

  const handleSelectFolder = async (): Promise<void> => {
    const result = await window.api.readDirectory()
    if (result === undefined) {
      new Notification('Muser', { body: 'You must select a folder!' })
    } else if (result[1].length === 0) {
      new Notification('Muser', { body: 'There are no audio files in this directory!' })
    } else {
      updateSetting({ directoryPath: result[0] })
      updateAudioList(result[1])
      updateCurrentAudio(0)
    }
  }

  const handleModal = (): void => setIsOpen(!isOpen)

  return (
    <>
      <div className="p:16 flex flex:col br:1|solid|black/.05 overflow:auto">
        <div className="drag-region:drag flex jc:space-between ai:center bg:white">
          <IconButton onClick={handleSelectFolder}>
            <TbFolder />
          </IconButton>
          <IconButton onClick={handleModal}>
            <TbChartCandle />
          </IconButton>
        </div>
        <Divider />
        <AudioList />
        <p className="f:12 color:#404348 ls:2 t:center">
          {directoryPath || 'Please select a folder.'}
        </p>
      </div>
      <SettingModal isOpen={isOpen} close={handleModal} />
    </>
  )
}
