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
    <button
      className={`drag-region:no-drag p:8 r:4 color:black/.5 bg:black/.2:active bg:black/.1:hover color:gray-80:disabled ~background-color|ease-in|150ms ${styles}`}
      {...props}
    >
      {children}
    </button>
  )
}
