import React from 'react'
import ReactDOM from 'react-dom'
import Header from './component/Header'
import Main from './container/main'
import Auxiliary from './component/Auxiliary'

addEventListener('load', () => ReactDOM.render(
    (<div>
        <Header />
        <Main />
        <Auxiliary />
    </div>), document.querySelector('main')))