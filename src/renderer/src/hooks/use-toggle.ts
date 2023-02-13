import { useCallback, useState } from 'react'

function useToggle(initialValue = false) {
  const [toggle, setToggle] = useState(initialValue)
  const handleToggle = useCallback((value?: boolean) => {
    typeof value === 'boolean' ? setToggle(value) : setToggle((prev) => !prev)
  }, [])

  return [toggle, handleToggle] as const
}

export default useToggle
