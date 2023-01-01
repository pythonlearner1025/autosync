import React, { useState, useEffect, useRef } from 'react';
import min from "../assets/download.svg"
import minBlack from "../assets/min.svg"


const Info = (props) => {
    const [isMin, setIsMin] = useState(false) 
    // visuals
    const [maxDims, setMaxDims] = useState({width: 500, height: 310})
    const [minDims, setMinDims] = useState({width: 45, height: 25})
    const [position, setPosition] = useState({x:0, y:0})

    // initial pos
    useEffect((()=> {
        const x = window.innerWidth/2-maxDims.width/2 
        const y = window.innerHeight/2-maxDims.height/2
        setPosition({x:x, y:y})
    }), [])

    const handleMove = (event) => {
        const currentX = event.clientX;
        const currentY = event.clientY;
        const initialX = position.x;
        const initialY = position.y;
        const xOffset = currentX - initialX;
        const yOffset = currentY - initialY;
    
        const handleMouseMove = (event) => {
          event.preventDefault();
          setPosition({
            x: event.clientX - xOffset,
            y: event.clientY - yOffset,
          });
        };
    
        const handleMouseUp = () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
    
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };


    const handleMinMax = () => {
        setIsMin(!isMin)
    }

    if (isMin) {
        return (
            <div 
            onMouseDown={handleMove} 
            className="info-min header-font med"
            style={{
                top: position.y,
                left: position.x + (maxDims.width - minDims.width),
                width: minDims.width,
                height: minDims.height
            }}
            >
                 <p style={{color: 'white', cursor: 'pointer'}}>Info</p>
                  <img 
                    style={{paddingTop: 5, paddingRight: 5}}
                    className='max' 
                    src={min} 
                    width='15px' 
                    height='15px'
                    onClick={handleMinMax}
                    />
            </div>
    ) 
    } else {
        return (
            <div 
            className="info-max"
            style={{
                top: position.y,
                left: position.x,
                width: maxDims.width,
                height: maxDims.height
            }} >
                 <div 
                 className='tool-header header-font med'
                 onMouseDown={handleMove} 
                 >
                    <p style={{paddingRight: 90, paddingLeft: 5}}>What's This?</p>
                    <img 
                    style={{paddingTop: 5, paddingRight: 5}}
                    className='min' 
                    src={min} 
                    width='15px' 
                    height='15px'
                    onClick={handleMinMax}
                    />
                </div>
                <div className="info-text">
                    <p style={{marginTop: 10}}>This is a simple tool to sync Deforum Animation keyframes to music.</p>
                    <p style={{marginLeft: 15}}>You can:</p>
                    <li style={{color: 'white', marginLeft: 25}}>detect and plot beats of music</li>
                    <li style={{color: 'white', marginLeft: 25}}>fit sinusoid functions to beats</li>
                    <li style={{color: 'white', marginLeft: 25}}>edit sinusoid functions </li>
                    <li style={{color: 'white', marginLeft: 25}}>export functions for Deforum Notebook</li>
                    <p style={{marginLeft: 15, marginTop: 10}}>PM me on twitter for questions / feature requests</p>
                    <div style={{display: 'flex', marginLeft: '60%'}}>
                        <div className="link"><a href="https://colab.research.google.com/github/deforum-art/deforum-stable-diffusion/blob/main/Deforum_Stable_Diffusion.ipynb">Deforum</a></div>
                        <div className="link"><a href="https://twitter.com/song_minjune">Twitter</a></div>
                        <div className="link"><a href="https://github.com/pythonlearner1025/autosync">Github</a></div>
                    </div>
                </div>
            </div>
        )
    }

}

/*
    This is a simple tool to sync keyframes to music. 
    You can:
        * detect & plot beats of music
        * fit sinusoid functions to beats 
        * edit sinusoid functions 
        * export functions for Deforum Notebook
    
    PM me on twitter for questions / feature requests. 
    Maker: Minjune Song | Twitter | Github
*/

export default Info