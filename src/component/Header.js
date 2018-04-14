import React from 'react'

export default class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <header className="header_container">
                <div className="header_title">Moc 1.1</div>
            </header>)
    }
}