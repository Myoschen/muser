import { TbX, TbMinus } from 'react-icons/tb'
import MusicPlayer from '@components/MusicPlayer'
import Button from '@components/common/Button'
import Sidebar from '@components/Sidebar/Sidebar'
import useSetup from '@hooks/use-setup'
import useThemeSwitch from '@hooks/use-theme-switch'
import useWatchFiles from '@hooks/use-watch-files'

export default function App() {
  useSetup()
  useThemeSwitch()
  useWatchFiles()

  return (
    <div className="{user-select:none;user-drag:none;f:antialiased}_* rel grid grid-template-cols:300|1fr grid-template-rows:100vh">
      {/* Sidebar 側邊欄 */}
      <Sidebar />

      {/* Music Player 音樂撥放器 */}
      <MusicPlayer />

      {/* Control Buttons 控制按鈕 */}
      <div className="abs top:16 right:12 flex gap-x:4">
        {/* <Button type="button" icon={<TbMinus />} /> */}
        <Button type="button" icon={<TbX />} onClick={async () => await window.api.closeApp()} />
      </div>
    </div>
  )
}
