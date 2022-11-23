import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import el from '@master/style-element.react'
import useStore, { Setting } from '@renderer/store'

interface SettingModalProps {
  isOpen: boolean
  close: () => void
}

export default function SettingModal(props: SettingModalProps): React.ReactPortal | null {
  const { isOpen, close } = props

  /* State */
  const setting = useStore((state) => state.setting)
  const updateSetting = useStore((state) => state.updateSetting)
  const [defaultVolume, setDefaultVolume] = useState<Setting['defaultVolume']>()
  const [theme, setTheme] = useState<Setting['theme']>()
  const [closeAction, setCloseAction] = useState<Setting['closeAction']>()

  const settingMemo = useMemo(
    () => ({
      theme: setting.theme,
      defaultVolume: setting.defaultVolume,
      closeAction: setting.closeAction
    }),
    [setting.theme, setting.defaultVolume, setting.closeAction]
  )

  /* Handler */
  const handleDefaultVolume = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setDefaultVolume(Number(e.target.value))
  const handleCloseModel = (): void => {
    if (
      setting.theme !== theme ||
      setting.closeAction !== closeAction ||
      setting.defaultVolume !== defaultVolume
    ) {
      setTheme(setting.theme)
      setCloseAction(setting.closeAction)
      setDefaultVolume(setting.defaultVolume)
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
    await window.api.updateAppSetting({ theme, closeAction, defaultVolume })
    updateSetting({ theme, closeAction, defaultVolume })
  }

  useEffect(() => {
    setTheme(setting.theme)
    setCloseAction(setting.closeAction)
    setDefaultVolume(setting.defaultVolume)
  }, [settingMemo])

  useEffect(() => {
    const bodyClasses = window.document.body.classList
    if (isOpen) {
      bodyClasses.add('overflow:hidden')
    }
    return () => {
      bodyClasses.remove('overflow:hidden')
    }
  }, [isOpen])

  const modal = (
    <>
      {/*  */}
      <Overlay aria-hidden />
      <ModelContainer className="">
        <ModelBody className="p:24|16 r:8 bg:white grid">
          <ModelTitle>Setting</ModelTitle>
          <ModelForm>
            <Label htmlFor="defaultVolume">Default Volume</Label>
            <input
              className="p:6|12 r:4 b:1|solid|secondary-dark/.25 border-color:secondary/.25@dark f:14 f:light ls:1 color:primary color:primary-dark@dark outline:none"
              type="number"
              name="defaultVolume"
              id="defaultVolume"
              value={defaultVolume}
              onChange={handleDefaultVolume}
              max={1}
              min={0}
              step={0.01}
            />
            <Label htmlFor="theme">Theme</Label>
            <select
              className="p:6|12 r:4 b:1|solid|secondary-dark/.25 border-color:secondary/.25@dark f:14 f:light ls:1 color:primary color:primary-dark@dark outline:none"
              name="theme"
              id="theme"
              value={theme}
              onChange={handleTheme}
            >
              <option value="light">light</option>
              <option value="dark">dark</option>
            </select>
            <Label htmlFor="closeAction">Close Action</Label>
            <div className="flex gap:8" id="closeAction">
              <Radio
                type="radio"
                value="quit"
                id="quit"
                checked={closeAction === 'quit'}
                onChange={handleCloseAction}
              />
              <RadioLabel htmlFor="quit">
                <RadioChecked />
                quit
              </RadioLabel>
              <Radio
                type="radio"
                value="hide"
                id="hide"
                checked={closeAction === 'hide'}
                onChange={handleCloseAction}
              />
              <RadioLabel htmlFor="hide">
                <RadioChecked />
                hide
              </RadioLabel>
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

const Radio = el.input`
  hide
  opacity:1:checked+label>span::after
`

const RadioLabel = el.label`
  flex
  ai:center
  gap:4
  cursor:pointer
  color:primary
  color:primary-dark@dark
`

const RadioChecked = el.span`
  rel
  inline-block
  w:14
  h:14
  b:2|solid
  border-color:primary
  border-color:primary-dark@dark
  r:50%
  abs::after
  top:50%::after
  left:50%::after
  content:""::after
  block::after
  h:6::after
  w:6::after
  r:50%::after
  bg:primary::after
  bg:primary-dark::after@dark
  translate(-50%,-50%)::after
  opacity:0::after
  ~opacity|200ms|ease-in::after
`
