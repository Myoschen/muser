import { useEffect } from 'react'
import Sidebar from '@renderer/components/Sidebar'
import AudioPlayer from '@renderer/components/AudioPlayer'
import Container from '@renderer/components/Container'
import CloseApp from '@renderer/components/CloseApp'
import useStore from '@renderer/store'

export default function App(): JSX.Element {
  const updateSetting = useStore((state) => state.updateSetting)
  const updateAudioList = useStore((state) => state.updateAudioList)
  const updateCurrentAudio = useStore((state) => state.updateCurrentAudio)

  useEffect(() => {
    window.api.onSetup(async (_event, args) => {
      console.log(args)

      const list = await window.api.getAudioList(args['directoryPath'])
      updateSetting(args)
      updateAudioList(list)
      updateCurrentAudio(0)
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
