import { useEffect } from 'react'
import el from '@master/style-element.react'
import Sidebar from '@renderer/components/Sidebar'
import AudioPlayer from '@renderer/components/AudioPlayer'
import CloseButton from '@renderer/components/CloseButton'
import useStore from '@renderer/store'

export default function App(): JSX.Element {
  const theme = useStore((state) => state.setting.theme)
  const updateSetting = useStore((state) => state.updateSetting)
  const updateAudioList = useStore((state) => state.updateAudioList)
  const updateCurrentAudio = useStore((state) => state.updateCurrentAudio)

  useEffect(() => {
    window.api.onSetup(async (_event, args) => {
      const list = await window.api.getAudioList(args['directoryPath'])
      updateSetting(args)
      updateAudioList(list)
      updateCurrentAudio(0)
    })
  }, [])

  useEffect(() => {
    const body = document.querySelector('body')
    body?.classList.toggle('light')
    body?.classList.toggle('dark')
  }, [theme])

  return (
    <Container>
      <Sidebar />
      <AudioPlayer />
      <CloseButton />
    </Container>
  )
}

// Styles
const Container = el.div`
  {user-select:none;user-drag:none;f:antialiased}_*
  rel
  grid
  grid-template-cols:300|1fr
  grid-template-rows:100vh
`
