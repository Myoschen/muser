/* Prevent @master/css from initializing automatically */
window.MasterCSSManual = true

import { Style, init } from '@master/css'

// Reuse classes
Style.extend('classes', {
  scrollbar: `
    {w:5;h:5;rounded}::scrollbar
    bg:secondary-dark/.05::scrollbar
    bg:secondary/.05::scrollbar@dark
    bg:transparent::scrollbar-corner
    bg:primary/.5::scrollbar-thumb
    bg:primary/.3::scrollbar-thumb:hover
    bg:primary/.15::scrollbar-thumb:active
    bg:primary-dark/.5::scrollbar-thumb@dark
    bg:primary-dark/.3::scrollbar-thumb:hover@dark
    bg:primary-dark/.15::scrollbar-thumb:active@dark
    rounded::scrollbar-thumb
  `
})

// Reuse colors
Style.extend('colors', {
  primary: '7c91b3',
  'primary-dark': 'c89096',
  secondary: 'f8f8f8',
  'secondary-dark': '313742'
})

init()
