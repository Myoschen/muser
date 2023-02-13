import clsx from 'clsx'
import { ComponentPropsWithoutRef } from 'react'

interface Props extends ComponentPropsWithoutRef<'label'> {
  styles?: string
}

function Label({ styles, children, ...rest }: Props) {
  return (
    <label
      className={clsx(
        'user-select:none f:14 f:light t:right ls:1 color:primary color:primary-dark@dark',
        styles
      )}
      {...rest}
    >
      {children}
    </label>
  )
}

export default Label
