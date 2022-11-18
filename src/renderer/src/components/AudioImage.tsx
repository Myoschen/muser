import MuserIcon from '../assets/icon.png'

interface AudioImageProps {
  src: string
}

export default function AudioImage({ src }: AudioImageProps): JSX.Element {
  return (
    <div className="flex:3 flex jc:center ai:center">
      <img
        className="w:320 drop-shadow(0|5|20|black/.2)"
        src={src || MuserIcon}
        alt="music-list-image"
      />
    </div>
  )
}
