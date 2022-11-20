import useStore from '@renderer/store'

export default function AudioTitle(): JSX.Element {
  const currentAudioName = useStore((state) => state.currentAudioName)

  return (
    <div className="drag-region:drag rel flex jc:space-between ai:center">
      <p className="flex:1 p:24 f:20 t:center color:primary color:primary-dark@dark ls:2">
        {currentAudioName ? currentAudioName.split('.')[0] : 'Muser - A Simple Music Player'}
      </p>
    </div>
  )
}
