import { useMemo } from 'react'
import el from '@master/style-element.react'
import useStore from '@renderer/store'

export default function AudioTitle(): JSX.Element {
  const currentAudioName = useStore((state) => state.currentAudioName)
  const title = useMemo(() => {
    return currentAudioName ? currentAudioName.split('.')[0] : 'Muser - A Simple Music Player'
  }, [currentAudioName])

  return (
    <Container>
      <Content>{title}</Content>
    </Container>
  )
}

/* Styles */
const Container = el.div`
  drag-region:drag
  rel
  flex
  jc:space-between
  ai:center
`

const Content = el.p`
  flex:1
  p:24
  f:20
  t:center
  ls:2
  color:primary
  color:primary-dark@dark
`
