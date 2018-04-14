import React from 'react'
import ReactDOM from 'react-dom'
import Header from './component/Header.js'
import Main from './container/main.js'

addEventListener('load', () => ReactDOM.render(
    (<div>
        <Header />
        <Main />
    </div>), document.querySelector('#root')))