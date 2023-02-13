import { useEffect } from 'react'
import { useAppDispatch } from '@features/hooks'
import { updateConfiguration } from '@features/slices/configuration'
import { updateMusicList } from '@features/slices/music'
import { setVolume } from '@features/slices/player'

function useSetup() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    window.api.onSetup(async (_event, args) => {
      const list = await window.api.getMusicList()
      dispatch(updateConfiguration(args))
      dispatch(updateMusicList(list ?? []))
      dispatch(setVolume(args.defaultVolume))
    })
  }, [])
}

export default useSetup
