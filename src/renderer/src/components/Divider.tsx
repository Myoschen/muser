import el from '@master/style-element.react'

export default function Divider(): JSX.Element {
  return <StyledDiv />
}

/* Styles */
const StyledDiv = el.div`
  w:full
  h:2
  my:8
  rounded
  bg:secondary-dark/.05
  bg:secondary/.05@dark
`
