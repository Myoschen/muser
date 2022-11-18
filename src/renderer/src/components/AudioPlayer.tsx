import AudioTitle from '@renderer/components/AudioTitle'
import AudioImage from '@renderer/components/AudioImage'
import AudioControl from '@renderer/components/AudioControl'

export default function AudioPlayer(): JSX.Element {
  return (
    <>
      <div className="flex flex:col bg:black/.02">
        <AudioTitle />
        <AudioImage src="" />
        <AudioControl />
      </div>
    </>
  )
}
