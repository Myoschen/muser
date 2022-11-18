import useStore from '@renderer/store'

interface AudioItemProps {
  index: number
  audioName: string
}

export default function AudioItem({ index, audioName }: AudioItemProps): JSX.Element {
  const updateCurrentAudio = useStore((state) => state.updateCurrentAudio)

  return (
    <li className="min-w:0 my:4 mr:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms overflow:hidden">
      <button
        className="w:full p:8|16 f:14 ls:1 t:left overflow:hidden t:ellipsis white-space:nowrap"
        onClick={(): void => updateCurrentAudio(index)}
      >
        {audioName.split('.')[0]}
      </button>
    </li>
  )
}
