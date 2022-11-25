import { memo } from 'react'
import el from '@master/style-element.react'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  styles?: string
}

function IconButton(props: IconButtonProps): JSX.Element {
  const { icon, styles, ...rest } = props
  return (
    <Button className={styles} {...rest}>
      {icon}
    </Button>
  )
}

export default memo(IconButton)

const Button = el.button`
  drag-region:no-drag
  p:8
  r:4
  color:primary
  color:primary-dark@dark
  color:gray-80:disabled
  bg:secondary-dark/.1:active
  bg:secondary-dark/.05:hover
  bg:secondary/.05:active@dark
  bg:secondary/.1:hover@dark
  ~background-color|ease-in|150ms
`
