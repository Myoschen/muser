import { useEffect } from 'react'
import Sidebar from '@renderer/components/Sidebar'
import AudioPlayer from '@renderer/components/AudioPlayer'
import Container from '@renderer/components/Container'
import CloseApp from '@renderer/components/CloseApp'
import useStore from '@renderer/store'

export default function App(): JSX.Element {
  const updateConfig = useStore((state) => state.updateConfig)
  const updateAudioList = useStore((state) => state.updateAudioList)
  const updateCurrentAudio = useStore((state) => state.updateCurrentAudio)

  useEffect(() => {
    window.api.onSetup(async (event, args) => {
      const list = await window.api.getAudioList(args['directory_path'])
      updateConfig(args)
      updateAudioList(list)
      updateCurrentAudio(0)
      event.sender.send('app:init-finished')
    })
  }, [])

  return (
    <Container>
      <Sidebar />
      <AudioPlayer />
      <CloseApp />
    </Container>
  )
}
