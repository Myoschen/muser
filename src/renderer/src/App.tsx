import { useEffect } from 'react'
import el from '@master/style-element.react'
import Sidebar from '@renderer/components/Sidebar'
import AudioPlayer from '@renderer/components/AudioPlayer'
import CloseButton from '@renderer/components/CloseButton'
import useStore from '@renderer/store'

export default function App(): JSX.Element {
  const theme = useStore((state) => state.setting.theme)
  const directoryPath = useStore((state) => state.setting.directoryPath)
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
    const callback = async (): Promise<void> => {
      const list = await window.api.getAudioList(directoryPath)
      updateAudioList(list)
      updateCurrentAudio(0)
    }
    window.api.onReload(callback)
    return () => {
      window.api.removeOnReload(callback)
    }
  }, [directoryPath])

  useEffect(() => {
    const body = document.querySelector('body')
    const toggleTheme = (next: string, prev: string): void => {
      body?.classList.add(next)
      body?.classList.remove(prev)
    }
    theme === 'light' ? toggleTheme('light', 'dark') : toggleTheme('dark', 'light')
  }, [theme])

  return (
    <Container>
      <Sidebar />
      <AudioPlayer />
      <CloseButton />
    </Container>
  )
}

/**
 * Styles
 */
const Container = el.div`
  {user-select:none;user-drag:none;f:antialiased}_*
  rel
  grid
  grid-template-cols:300|1fr
  grid-template-rows:100vh
`
