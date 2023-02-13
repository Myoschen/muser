import { useEffect } from 'react'
import { useAppSelector, selectConfiguration } from '@features/hooks'

function useThemeSwitch() {
  const {
    configuration: { theme }
  } = useAppSelector(selectConfiguration)

  useEffect(() => {
    const toggleTheme = () => {
      const body = document.body
      body.classList.remove('light', 'dark')
      theme === 'light' ? body.classList.add('light') : body.classList.add('dark')
    }
    toggleTheme()
  }, [theme])
}

export default useThemeSwitch
