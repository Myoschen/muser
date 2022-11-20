/* Prevent @master/css from initializing automatically */
window.MasterCSSManual = true

import { Style, init } from '@master/css'

// Reuse classes
Style.extend('classes', {
  scrollbar: `
    {w:5;h:5;rounded}::scrollbar
    bg:fade-90::scrollbar
    bg:gray-22::scrollbar@dark
    bg:transparent::scrollbar-corner
    bg:fade-88::scrollbar-thumb
    bg:fade-78::scrollbar-thumb:hover
    bg:fade-66::scrollbar-thumb:active
    bg:gray-30::scrollbar-thumb@dark
    bg:gray-60::scrollbar-thumb:hover@dark
    bg:gray-60::scrollbar-thumb:active@dark
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
