import React from 'react'
import ReactDOM from 'react-dom'
import Header from './component/Header'
import Main from './container/main'
import ReactSlider from 'react-slider'

addEventListener('load', () => ReactDOM.render(
    (<div>
        <Header></Header>
        <Main></Main>
    </div>), document.querySelector('#root')))