import { ComponentPropsWithoutRef } from 'react'

interface Props extends ComponentPropsWithoutRef<'select'> {
  options: string[]
}

function Select({ options, ...rest }: Props) {
  return (
    <select
      className="p:6|12 r:4 b:1|solid|secondary-dark/.25 border-color:secondary/.25@dark f:14 f:light ls:1 color:primary color:primary-dark@dark outline:none"
      {...rest}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

export default Select
