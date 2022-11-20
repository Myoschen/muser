import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import el from '@master/style-element.react'
import useStore, { Setting } from '@renderer/store'

interface SettingModalProps {
  isOpen: boolean
  close: () => void
}

export default function SettingModal({
  isOpen,
  close
}: SettingModalProps): React.ReactPortal | null {
  /* State */
  const setting = useStore((state) => state.setting)
  const updateSetting = useStore((state) => state.updateSetting)
  const [theme, setTheme] = useState<typeof setting['theme']>(setting.theme)
  const [closeAction, setCloseAction] = useState<typeof setting['closeAction']>(setting.closeAction)

  /* Handler */
  const handleCloseModel = (): void => {
    if (setting.theme !== theme || setting.closeAction !== closeAction) {
      setTheme(setting.theme)
      setCloseAction(setting.closeAction)
    }
    close()
  }
  const handleTheme = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selected = e.target.value as unknown as Setting['theme']
    setTheme(selected)
  }
  const handleCloseAction = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const checked = e.target.value as unknown as Setting['closeAction']
    setCloseAction(checked)
  }
  const handleSave = async (): Promise<void> => {
    await window.api.updateAppSetting({ theme, closeAction })
    updateSetting({ theme, closeAction })
  }

  const modal = (
    <>
      {/*  */}
      <Overlay aria-hidden />
      <ModelContainer className="">
        <ModelBody className="p:24|16 r:8 bg:white grid">
          <ModelTitle>Setting</ModelTitle>
          <ModelForm>
            <Label htmlFor="directoryPath">Directory Path</Label>
            <input
              className="p:6|12 r:4 b:1|solid|secondary-dark/.25 border-color:secondary/.25@dark f:14 f:light ls:1 color:gray-80:disabled"
              type="text"
              name="directoryPath"
              id="directoryPath"
              value={setting.directoryPath}
              disabled
            />
            <Label htmlFor="theme">Theme</Label>
            <select
              className="p:6|12 r:4 b:1|solid|secondary-dark/.25 border-color:secondary/.25@dark f:14 f:light ls:1 color:primary color:primary-dark@dark"
              name="theme"
              id="theme"
              value={theme}
              onChange={handleTheme}
            >
              <option value="light">light</option>
              <option value="dark">dark</option>
            </select>
            <Label htmlFor="closeAction">Close Action</Label>
            <div className="flex ai:center f:14 gap:8" id="closeAction">
              <input
                type="radio"
                value="quit"
                id="quit"
                checked={closeAction === 'quit'}
                onChange={handleCloseAction}
              />
              <Label htmlFor="quit">quit</Label>
              <input
                type="radio"
                value="hide"
                id="hide"
                checked={closeAction === 'hide'}
                onChange={handleCloseAction}
              />
              <Label htmlFor="hide">hide</Label>
            </div>
          </ModelForm>
          <Control>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
            <Button type="button" onClick={handleCloseModel}>
              Close
            </Button>
          </Control>
        </ModelBody>
      </ModelContainer>
    </>
  )

  useEffect(() => {
    const bodyClasses = window.document.body.classList
    if (isOpen) {
      bodyClasses.add('overflow:hidden')
    }
    return () => {
      bodyClasses.remove('overflow:hidden')
    }
  }, [isOpen])

  return isOpen ? createPortal(modal, window.document.body) : null
}

const Overlay = el.div`
  z:1
  fixed
  inset:0
  bg:black/.15
  bg:black/.3@dark
`

const ModelContainer = el.div`
  z:2
  fixed
  top:50%
  left:50%
  w:500
  translate(-50%,-50%)
`

const ModelBody = el.div`
  p:24|16
  r:8
  w:full
  grid
  bg:secondary
  bg:secondary-dark@dark
`

const ModelTitle = el.h1`
  user-select:none
  f:28
  f:light
  t:center
  ls:2
  color:primary
  color:primary-dark@dark
`

const ModelForm = el.div`
  my:32
  grid
  grid-template-cols:120|1fr
  gap:24
  ai:center
`

const Label = el.label`
  user-select:none
  f:14
  f:light
  t:right
  ls:1
  color:primary
  color:primary-dark@dark
`

const Control = el.div`
  flex
  jc:center
  ai:center
  gap:16
`

const Button = el.button`
  p:4|8
  r:4
  f:14
  f:light
  ls:1
  color:primary
  color:primary-dark@dark
  bg:secondary-dark/.1:active
  bg:secondary-dark/.05:hover
  bg:secondary/.05:active@dark
  bg:secondary/.1:hover@dark
  ~background-color|150ms|ease-in
`
