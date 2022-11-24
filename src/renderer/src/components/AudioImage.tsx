import el from '@master/style-element.react'
import MuserIcon from '../assets/icon.png'

interface AudioImageProps {
  src: string
}

// TODO Replace image if src exists
export default function AudioImage(props: AudioImageProps): JSX.Element {
  const { src } = props
  return (
    <ImageContainer>
      <Image src={src || MuserIcon} alt="music-list-image" />
    </ImageContainer>
  )
}

const ImageContainer = el.div`
  flex:3
  flex
  jc:center
  ai:center
`

const Image = el.img`
  w:320
  hue-rotate(0)
  hue-rotate(135)@dark
`
