import './Titlebar.css'
import React from 'react'
import { X } from 'react-feather';


function Titlebar() {
    const closeWindow = (e) => {
        window.close()

    };

    return (
        <div className='titlebar no-select'>
            <div className='titlebar-label'>
                <span>TalkGPT</span>
            </div>
            <div className="titlebar-close" onClick={closeWindow}>
            <X />    
            </div>
          
        </div>
        )
}

export default Titlebar