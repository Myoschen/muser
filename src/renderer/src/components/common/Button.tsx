import clsx from 'clsx'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

interface Props extends ComponentPropsWithoutRef<'button'> {
  styles?: string
  icon?: ReactNode
  text?: string
}

function Button({ styles, icon, text, ...rest }: Props) {
  return (
    <button
      className={clsx(
        'drag-region:no-drag flex ai:center gap-x:4 p:8 r:4 color:primary color:primary-dark@dark color:gray-80:disabled bg:secondary-dark/.1:active bg:secondary-dark/.05:hover bg:secondary/.05:active@dark bg:secondary/.1:hover@dark ~background-color|ease-in|150ms',
        styles
      )}
      {...rest}
    >
      {icon}
      {text && <span>{text}</span>}
    </button>
  )
}

export default Button
