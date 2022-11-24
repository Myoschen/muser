import { useMemo, useState } from 'react'
import { TbChartCandle, TbFolder } from 'react-icons/tb'
import el from '@master/style-element.react'
import AudioList from '@renderer/components/AudioList'
import SettingModal from '@renderer/components/SettingModal'
import IconButton from '@renderer/components/IconButton'
import Divider from '@renderer/components/Divider'
import useStore from '@renderer/store'
import notify from '@renderer/utils/notify'

export default function Sidebar(): JSX.Element {
  const directoryPath = useStore((state) => state.setting.directoryPath)
  const updateSetting = useStore((state) => state.updateSetting)
  const updateAudioList = useStore((state) => state.updateAudioList)
  const updateCurrentAudio = useStore((state) => state.updateCurrentAudio)

  const directoryName = useMemo(() => directoryPath.split('\\').at(-1), [directoryPath])
  const [isOpen, setIsOpen] = useState(false) // If true will open setting modal

  // Get directory path through dialog
  const handleSelectFolder = async (): Promise<void> => {
    const result = await window.api.readDirectory()
    if (result === undefined) {
      notify.info('You must select a folder!')
    } else if (result[1].length === 0) {
      notify.info('There are no audio files in this directory!')
    } else {
      updateSetting({ directoryPath: result[0] })
      updateAudioList(result[1])
      updateCurrentAudio(0)
    }
  }

  const handleModal = (): void => setIsOpen((prev) => !prev)

  return (
    <>
      <Container>
        <Control>
          <IconButton icon={<TbFolder />} onClick={handleSelectFolder} />
          <IconButton icon={<TbChartCandle />} onClick={handleModal} />
        </Control>
        <Divider />
        <AudioList />
        <StatusBar>
          <span className="ls:1 color:primary color:primary-dark@dark">
            {directoryName || 'Please select a folder containing audio.'}
          </span>
        </StatusBar>
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

const StatusBar = el.div`
  flex
  jc:center
`
