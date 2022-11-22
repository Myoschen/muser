import { TbX } from 'react-icons/tb'
import IconButton from '@renderer/components/IconButton'

export default function CloseButton(): JSX.Element {
  const handleClose = async (): Promise<void> => await window.api.closeApp()

  return <IconButton icon={<TbX />} styles="abs top:16 right:16" onClick={handleClose} />
}
