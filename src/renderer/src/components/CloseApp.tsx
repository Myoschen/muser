import { TbX } from 'react-icons/tb'
import IconButton from '@renderer/components/IconButton'

export default function CloseApp(): JSX.Element {
  const handleClose = async (): Promise<void> => window.api.closeApp()

  return (
    <IconButton onClick={handleClose} styles="abs top:16 right:16">
      <TbX />
    </IconButton>
  )
}
