import el from '@master/style-element.react'
import useStore from '@renderer/store'

interface AudioItemProps {
  index: number
  audioName: string
}

export default function AudioItem({ index, audioName }: AudioItemProps): JSX.Element {
  const updateCurrentAudio = useStore((state) => state.updateCurrentAudio)

  return (
    <Item>
      <Button onClick={(): void => updateCurrentAudio(index)}>{audioName.split('.')[0]}</Button>
    </Item>
  )
}

const Item = el.li`
  min-w:0
  my:4
  mr:8
  r:4
  bg:secondary-dark/.1:active
  bg:secondary-dark/.05:hover
  bg:secondary/.05:active@dark
  bg:secondary/.1:hover@dark
  ~background-color|ease-in|150ms
  overflow:hidden
`

const Button = el.button`
  w:full
  p:8|16
  f:14
  t:left
  t:ellipsis
  ls:1
  color:primary
  color:primary-dark@dark
  overflow:hidden
  white-space:nowrap
`
