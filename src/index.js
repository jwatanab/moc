import React from 'react'
import ReactDOM from 'react-dom'
import Header from './component/Header'
import Main from './container/main'


addEventListener('load', () => ReactDOM.render(
    (<div>
        <ReactSlider withBars>
            <div className="my-handle">1</div>
            <div className="my-handle">2</div>
            <div className="my-handle">3</div>
        </ReactSlider>
        <Header></Header>
        <Main></Main>
    </div>), document.querySelector('#root')))