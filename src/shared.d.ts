interface Configuration {
  directory: string
  theme: 'light' | 'dark'
  closeAction: 'hide' | 'quit'
  defaultVolume: number
}

interface Music {
  name: string
  src: string
}
