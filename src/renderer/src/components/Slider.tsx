import el from '@master/style-element.react'

interface SliderProps {
  max: number
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  step?: number
  styles?: string
  disabled?: boolean
}

export default function Slider({ styles, ...props }: SliderProps): JSX.Element {
  return <InputRange className={styles} type="range" min={0} {...props} />
}

const InputRange = el.input`
  appearance:none
  appearance:none::slider-thumb
  rel::slider-thumb
  top:-50%::slider-thumb
  w:8::slider-thumb
  h:8::slider-thumb
  r:50%::slider-thumb
  bg:secondary
  bg:secondary-dark@dark
  bg:secondary/.5:hover
  bg:secondary-dark/.5:hover@dark
  bg:primary::slider-thumb
  bg:primary-dark::slider-thumb@dark
  bg:primary/.75::slider-thumb:hover
  bg:primary-dark/.75::slider-thumb:hover@dark
  ~background-color|150ms|ease-in
  ~background-color|150ms|ease-in::slider-thumb
  h:4::slider-runnable-track
  r:8::slider-runnable-track
  bg:black/.05::slider-runnable-track
`
