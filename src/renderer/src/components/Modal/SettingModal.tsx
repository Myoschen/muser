import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import Button from '../common/Button'
import Input from '../common/Input'
import Label from '../common/Label'
import Select from '../common/Select'
import { useState } from 'react'
import { useAppSelector, selectConfiguration, useAppDispatch } from '@features/hooks'
import { updateConfiguration } from '@features/slices/configuration'

type Props = {
  handleClose: () => void
}

function SettingModal({ handleClose }: Props) {
  const { configuration } = useAppSelector(selectConfiguration)
  const dispatch = useAppDispatch()
  const [volume, setVolume] = useState(configuration.defaultVolume)
  const [theme, setTheme] = useState(configuration.theme)
  const [closeAction, setCloseAction] = useState(configuration.closeAction)

  const handleSave = async () => {
    if (!volume || !theme || !closeAction) return
    const data: Partial<Configuration> = {
      defaultVolume: volume,
      theme: theme,
      closeAction: closeAction
    }
    await window.api.updateConfiguration(data)
    dispatch(updateConfiguration(data))
  }

  const modal = (
    <motion.div>
      {/* Overlay 背景遮罩 */}
      <div className="z:1 fixed inset:0 bg:black/.15 bg:black/.3@dark" aria-hidden />

      {/* Modal body 互動視窗內容 */}
      <motion.div
        className="z:2 fixed top:50% left:50% w:500"
        initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
        animate={{ x: '-50%', y: '-50%', scale: 1, opacity: 1 }}
        exit={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="p:24|16 r:8 w:full grid bg:secondary bg:secondary-dark@dark">
          <h1 className="user-select:none f:28 f:light t:center ls:2 color:primary color:primary-dark@dark">
            Setting
          </h1>
          <div className="my:32 grid grid-template-cols:120|1fr gap:24 ai:center">
            <Label htmlFor="volume">Volume</Label>
            <Input
              type="number"
              id="volume"
              value={volume}
              onChange={(e) =>
                setVolume(parseFloat(e.target.value) as Configuration['defaultVolume'])
              }
              max={1}
              min={0}
              step={0.01}
            />
            <Label htmlFor="theme">Theme</Label>
            <Select
              options={['light', 'dark']}
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value as Configuration['theme'])}
            />
            <Label htmlFor="closeAction">Close Action</Label>
            <Select
              options={['quit', 'hide']}
              id="closeAction"
              value={closeAction}
              onChange={(e) => setCloseAction(e.target.value as Configuration['closeAction'])}
            />
          </div>
          <div className="flex jc:center ai:center gap:16">
            <Button type="button" onClick={handleSave} text="Save" />
            <Button type="button" onClick={handleClose} text="Close" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )

  return createPortal(modal, window.document.body)
}

export default SettingModal
