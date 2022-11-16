const secondsToTime = (sec: number): string => {
  const m = Math.floor((sec % 3600) / 60)
      .toString()
      .padStart(2, '0'),
    s = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0')
  return `${m}:${s}`
}

export { secondsToTime }
