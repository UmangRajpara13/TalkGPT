import './Titlebar.css'
import React from 'react'

function Titlebar() {
    const closeWindow = (e) => {
        window.close()

    };

    return (
        <div  className='titlebar no-select'>
            <div className='titlebar-label'>
                <span>TalkGPT</span>
            </div>
            <div className="titlebar-close" onClick={closeWindow}>
                <span>X</span>
            </div>
        </div>)
}

export default Titlebar