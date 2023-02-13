/* Prevent @master/css from initializing automatically */
// 避免 @master/css 自動初始化
window.MasterCSSManual = true

import { init, Style } from '@master/css'

// Extend classes
// 擴展類別
Style.extend('classes', {
  scrollbar: `
    {w:5;h:5;rounded}::scrollbar
    bg:secondary-dark/.05::scrollbar
    bg:secondary/.05::scrollbar@dark
    bg:transparent::scrollbar-corner
    bg:primary/.3::scrollbar-thumb
    bg:primary/.45::scrollbar-thumb:hover
    bg:primary/.6::scrollbar-thumb:active
    bg:primary-dark/.5::scrollbar-thumb@dark
    bg:primary-dark/.3::scrollbar-thumb:hover@dark
    bg:primary-dark/.15::scrollbar-thumb:active@dark
    rounded::scrollbar-thumb
  `
})

// Extend colors
// 擴展顏色
Style.extend('colors', {
  primary: '7c91b3',
  'primary-dark': 'c89096',
  secondary: 'f8f8f8',
  'secondary-dark': '313742'
})

// Initialize @master/css
// 初始化 @master/css
init()
