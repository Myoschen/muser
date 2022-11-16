import { useTrackDetail } from '@renderer/store'

export default function TrackList(): JSX.Element {
  const trackList = useTrackDetail((state) => state.trackList)
  const updateCurrentTrack = useTrackDetail((state) => state.updateCurrentTrack)

  return (
    <ul className="flex:1 w:full my:16 grid grid-template-cols:1fr grid-auto-rows:min-content overflow-y:auto scrollbar">
      {trackList &&
        trackList.map((track, index) => (
          <li
            className="min-w:0 my:4 mr:8 r:4 bg:black/.2:active bg:black/.1:hover ~background-color|ease-in|150ms overflow:hidden"
            key={`${index}\\${track}`}
          >
            <button
              className="w:full p:8|16 f:14 ls:1 t:left overflow:hidden t:ellipsis white-space:nowrap"
              onClick={(): void => updateCurrentTrack(index)}
            >
              {track.split('.')[0]}
            </button>
          </li>
        ))}
    </ul>
  )
}
