import { useEffect } from 'react'
import { useAppDispatch } from '@features/hooks'
import { updateMusicList } from '@features/slices/music'

function useWatchFiles() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const callback = async () => {
      const list = await window.api.getMusicList()
      dispatch(updateMusicList(list ?? []))
    }
    window.api.onReload(callback)

    // Clean up
    // 清除 side effect
    return () => {
      window.api.removeOnReload(callback)
    }
  }, [])
}

export default useWatchFiles
