import el from '@master/style-element.react'

interface IconButtonProps {
  children: React.ReactNode
  onClick: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  disabled?: boolean
  styles?: string
}

export default function IconButton({ children, styles, ...props }: IconButtonProps): JSX.Element {
  return (
    <Button className={styles} {...props}>
      {children}
    </Button>
  )
}

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
