import clsx from 'clsx'
import { ComponentPropsWithoutRef } from 'react'

interface Props extends ComponentPropsWithoutRef<'input'> {
  styles?: string
}

function Input({ styles, ...rest }: Props) {
  return (
    <input
      className={clsx(
        'p:6|12 r:4 b:1|solid|secondary-dark/.25 border-color:secondary/.25@dark f:14 f:light ls:1 color:primary color:primary-dark@dark outline:none',
        styles
      )}
      {...rest}
    />
  )
}

export default Input
