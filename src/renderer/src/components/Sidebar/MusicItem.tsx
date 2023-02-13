interface Props {
  name: string
  onClick: () => void
}

function MusicItem({ name, onClick }: Props) {
  return (
    <li className="min-w:0 my:4 mx:6 r:4 bg:secondary-dark/.1:active bg:secondary-dark/.05:hover bg:secondary/.05:active@dark bg:secondary/.1:hover@dark ~background-color|ease-in|150ms overflow:hidden">
      <button
        className="w:full p:8|16 f:14 t:left t:ellipsis ls:1 color:primary color:primary-dark@dark overflow:hidden white-space:nowrap"
        type="button"
        onClick={onClick}
      >
        {name}
      </button>
    </li>
  )
}

export default MusicItem
