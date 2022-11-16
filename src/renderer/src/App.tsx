import { useEffect } from 'react'
import Sidebar from '@renderer/components/Sidebar'
import Player from '@renderer/components/Player'
import Container from '@renderer/components/Container'
import { useAppConfig, useTrackDetail } from './store'

export default function App(): JSX.Element {
  const updateConfig = useAppConfig((state) => state.updateConfig)
  const updateTrackList = useTrackDetail((state) => state.updateTrackList)
  const updateCurrentTrack = useTrackDetail((state) => state.updateCurrentTrack)

  useEffect(() => {
    window.api.onSetup(async (event, args) => {
      const list = await window.api.getTrackList(args['directory_path'])
      updateConfig(args)
      updateTrackList(list)
      updateCurrentTrack(0)
      event.sender.send('app:init-finished')
    })
  }, [])

  return (
    <Container>
      <Sidebar />
      <Player />
    </Container>
  )
}
