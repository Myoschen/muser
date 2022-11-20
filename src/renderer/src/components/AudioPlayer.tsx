import el from '@master/style-element.react'
import AudioTitle from '@renderer/components/AudioTitle'
import AudioImage from '@renderer/components/AudioImage'
import AudioControl from '@renderer/components/AudioControl'

export default function AudioPlayer(): JSX.Element {
  return (
    <Container>
      <AudioTitle />
      <AudioImage src="" />
      <AudioControl />
    </Container>
  )
}

const Container = el.div`
  flex
  flex:col
  bg:secondary
  bg:secondary-dark@dark
`
