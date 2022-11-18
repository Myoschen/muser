import React from 'react'
import ReactDOM from 'react-dom/client'
import { Style, init } from '@master/css'

// Components
import App from './App'

// Styles
import './assets/index.css'

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
  `,
  slider: `
    appearance:none
    appearance:none::slider-thumb
    rel::slider-thumb
    top:-50%::slider-thumb
    w:8::slider-thumb
    h:8::slider-thumb
    r:50%::slider-thumb
    bg:gray-80::slider-thumb
    bg:gray-60::slider-thumb:hover
    ~background-color|150ms|ease-in::slider-thumb
    h:4::slider-runnable-track
    r:8::slider-runnable-track
    bg:black/.05::slider-runnable-track
  `
})

init()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
