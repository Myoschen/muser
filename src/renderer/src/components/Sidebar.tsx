import { useState } from 'react'
import { TbChartCandle, TbFolder } from 'react-icons/tb'
import el from '@master/style-element.react'
import AudioList from '@renderer/components/AudioList'
import SettingModal from '@renderer/components/SettingModal'
import IconButton from '@renderer/components/IconButton'
import Divider from '@renderer/components/Divider'
import useStore from '@renderer/store'

export default function Sidebar(): JSX.Element {
  const directoryPath = useStore((state) => state.setting.directoryPath)
  const updateSetting = useStore((state) => state.updateSetting)
  const updateAudioList = useStore((state) => state.updateAudioList)
  const updateCurrentAudio = useStore((state) => state.updateCurrentAudio)

  const [isOpen, setIsOpen] = useState(false) // If true will open setting modal

  // Get directory path through dialog
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
      <Container>
        <Control>
          <IconButton onClick={handleSelectFolder}>
            <TbFolder />
          </IconButton>
          <IconButton onClick={handleModal}>
            <TbChartCandle />
          </IconButton>
        </Control>
        <Divider />
        <AudioList />
        <Reminder>{directoryPath || 'Please select a folder.'}</Reminder>
      </Container>
      <SettingModal isOpen={isOpen} close={handleModal} />
    </>
  )
}

const Container = el.div`p:16
  flex
  flex:col
  bg:secondary/.5
  bg:secondary-dark/.98@dark
  br:1|solid|black/.05
  overflow:auto
`

const Control = el.div`
  drag-region:drag
  flex
  jc:space-between
  ai:center
`

const Reminder = el.p`
  f:12
  ls:2
  t:center
  color:primary
  color:primary-dark@dark
`
