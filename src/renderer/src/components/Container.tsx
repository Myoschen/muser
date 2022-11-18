interface ContainerProps {
  children: React.ReactNode
}

export default function Container({ children }: ContainerProps): JSX.Element {
  return (
    <div className="{user-select:none;user-drag:none;f:antialiased}_* rel grid grid-template-cols:300|1fr grid-template-rows:100vh">
      {children}
    </div>
  )
}
