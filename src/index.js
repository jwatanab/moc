import React from 'react'
import ReactDOM from 'react-dom'
import Header from './component/Header'
import Main from './container/main'

addEventListener('load', () => ReactDOM.render(
    (<div>
        <Header />
        <Main />
    </div>), document.querySelector('main')))