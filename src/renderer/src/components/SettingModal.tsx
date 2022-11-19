import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
      <div className="fixed z:1 inset:0 bg:black/.2" onClick={close} aria-hidden />
      <div className="fixed top:50% left:50% z:2 translate(-50%,-50%)">
        <div className="p:24|16 r:8 bg:white grid">
          <h1 className="f:28 f:medium ls:1 color:black/.75 t:center">Setting</h1>
          <div className="my:32 grid grid-template-cols:120|1fr gap:24 ai:center">
            <label className="f:14 f:light t:right ls:1" htmlFor="directoryPath">
              Directory Path
            </label>
            <input
              className="f:14 b:1|solid|black/.15 r:4 p:4|8 color:black/.25:disabled"
              type="text"
              name="directoryPath"
              id="directoryPath"
              value={setting.directoryPath}
              disabled
            />
            <label className="f:14 f:light t:right ls:1" htmlFor="theme">
              Theme
            </label>
            <select
              className="f:14 b:1|solid|black/.15 r:4 p:4|8"
              name="theme"
              id="theme"
              value={theme}
              onChange={handleTheme}
            >
              <option value="system">system</option>
              <option value="light">light</option>
              <option value="dark">dark</option>
            </select>
            <label className="f:14 f:light t:right ls:1" htmlFor="closeAction">
              Close Action
            </label>
            <div className="flex ai:center f:14 gap:8" id="closeAction">
              <input
                type="radio"
                value="quit"
                id="quit"
                checked={closeAction === 'quit'}
                onChange={handleCloseAction}
              />
              <label htmlFor="quit">quit</label>
              <input
                type="radio"
                value="hide"
                checked={closeAction === 'hide'}
                onChange={handleCloseAction}
              />
              <label htmlFor="hide">hide</label>
            </div>
          </div>
          <div className="flex jc:center ai:center gap:16">
            <button
              className="p:4|8 r:4 f:14 ls:1 color:black/.75 bg:black/.15:active bg:black/.05:hover ~background-color|150ms|ease-in b:1|solid|black/.075"
              type="button"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="p:4|8 r:4 f:14 ls:1 color:black/.75 bg:black/.15:active bg:black/.05:hover ~background-color|150ms|ease-in b:1|solid|black/.075"
              type="button"
              onClick={handleCloseModel}
            >
              Close
            </button>
          </div>
        </div>
      </div>
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
