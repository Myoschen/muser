/* reference: https://github.com/streamich/react-use */
import { RefObject, useEffect, useRef } from 'react'

const defaultEvents = ['mousedown', 'touchstart']

export const useClickAway = <E extends Event = Event>(
  ref: RefObject<HTMLElement | null>,
  onClickAway: (event: E) => void,
  events: string[] = defaultEvents
): void => {
  const savedCallback = useRef(onClickAway)

  useEffect(() => {
    savedCallback.current = onClickAway
  }, [onClickAway])

  useEffect(() => {
    const handler = (event: E): void => {
      const { current: el } = ref
      el && !el.contains(event.target) && savedCallback.current(event)
    }

    for (const eventName of events) {
      if (document) {
        document.addEventListener(eventName, handler)
      }
    }

    return () => {
      for (const eventName of events) {
        if (document) {
          document.removeEventListener(eventName, handler)
        }
      }
    }
  }, [events, ref])
}
