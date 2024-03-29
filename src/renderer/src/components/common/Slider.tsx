import clsx from 'clsx'
import { ComponentPropsWithoutRef } from 'react'

interface Props extends ComponentPropsWithoutRef<'input'> {
  styles?: string
}

function Slider({ styles, ...rest }: Props) {
  return (
    <input
      className={clsx(
        'appearance:none appearance:none::slider-thumb rel::slider-thumb top:-50%::slider-thumb w:8::slider-thumb h:8::slider-thumb r:50%::slider-thumb bg:secondary/.15::slider-runnable-track@dark bg:secondary-dark::slider-runnable-track/.15 bg:secondary/.1::slider-runnable-track:hover@dark bg:secondary-dark/.1::slider-runnable-track:hover bg:primary::slider-thumb bg:primary-dark::slider-thumb@dark bg:primary/.75::slider-thumb:hover bg:primary-dark/.75::slider-thumb:hover@dark ~background-color|150ms|ease-in::slider-runnable-track ~background-color|150ms|ease-in::slider-thumb h:4::slider-runnable-track r:8::slider-runnable-track bg:black/.05::slider-runnable-track',
        styles
      )}
      type="range"
      min={0}
      {...rest}
    />
  )
}

export default Slider
