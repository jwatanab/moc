import React from 'react'
import ReactDOM from 'react-dom'
import Header from './component/Header'
import Slider from './container/slides'
import Ui_Bar from './container/ui'
import Main from './container/main'

addEventListener('load', () => ReactDOM.render(
    (<div>
        <Ui_Bar />
        <Header />
        <Slider />
        <Main />

    </div>), document.querySelector('main')))