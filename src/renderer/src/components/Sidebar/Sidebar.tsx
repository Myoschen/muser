import { AnimatePresence } from 'framer-motion'
import { memo, useMemo } from 'react'
import { IconChartCandle, IconFolder, IconPlaylist } from '@tabler/icons-react'
import useToggle from '@hooks/use-toggle'
import { notify } from '@utils/notify'
import MusicList from './MusicList'
import Button from '../common/Button'
import { SettingModal } from '../Modal'
import { selectConfiguration, useAppDispatch, useAppSelector } from '@features/hooks'
import { updateConfiguration } from '@features/slices/configuration'
import { updateMusicList } from '@features/slices/music'
import { setMusicId } from '@features/slices/player'

function Sidebar() {
  const {
    configuration: { directory }
  } = useAppSelector(selectConfiguration)
  const dispatch = useAppDispatch()
  const [isModalOpen, handleIsModalOpen] = useToggle()

  const folderName = useMemo(() => directory.split('\\').at(-1), [directory])

  const handleSelectDirectory = async () => {
    const directory = await window.api.readDirectory()
    if (directory === undefined) {
      notify('You must select a folder.')
    } else {
      const list = await window.api.getMusicList()
      if (list?.length === 0) {
        notify('There are no music files in this folder.')
      } else {
        dispatch(updateConfiguration({ directory }))
        dispatch(updateMusicList(list ?? []))
        dispatch(setMusicId(0))
      }
    }
  }

  return (
    <>
      <div className="p:16 flex flex:col bg:secondary/.5 bg:secondary-dark/.98@dark br:1|solid|black/.05 overflow:auto ~background-color|150ms|ease-in-out">
        <div className="drag-region:drag flex jc:space-between ai:center">
          {/* Select Directory Button 選擇路徑按鈕 */}
          <Button icon={<IconFolder size={16} />} onClick={handleSelectDirectory} />
          {/* Setting Button 按鈕 */}
          <Button icon={<IconChartCandle size={16} />} onClick={() => handleIsModalOpen()} />
        </div>

        {/* Divider 分隔線 */}
        <div className="w:full h:2 my:8 rounded bg:secondary-dark/.05 bg:secondary/.05@dark" />

        {/* Music List 音樂列表 */}
        <MusicList />

        {/* Current Folder Name 當前資料夾名稱 */}
        <div className="flex jc:center ai:center gap-x:4 mt:16 color:primary color:primary-dark@dark">
          <IconPlaylist size={16} />
          <span className="ls:1">{folderName}</span>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {isModalOpen && <SettingModal handleClose={handleIsModalOpen} />}
      </AnimatePresence>
    </>
  )
}

export default memo(Sidebar)
