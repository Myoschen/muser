function secondsToMinutes(seconds: number) {
  const mins = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0')

  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${mins}:${secs}`
}

export { secondsToMinutes }
