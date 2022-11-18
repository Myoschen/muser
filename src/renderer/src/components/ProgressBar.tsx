interface ProgressBarProps {
  max: number
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  step?: number
  styles?: string
  disabled?: boolean
}

export default function ProgressBar({ styles, ...props }: ProgressBarProps): JSX.Element {
  return <input className={`slider ${styles}`} type="range" min={0} {...props} />
}
