import el from '@master/style-element.react'
import MuserIcon from '../assets/icon.png'

interface AudioImageProps {
  src: string
}

// TODO Replace image if src exists
export default function AudioImage({ src }: AudioImageProps): JSX.Element {
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
  drop-shadow(0|5|20|secondary-dark/.15)
  drop-shadow(0|5|20|secondary/.15)@dark
`
