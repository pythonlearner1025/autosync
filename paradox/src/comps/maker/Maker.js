import React, { useState, useEffect, useRef } from 'react';
import MakerControlFunc from "./MakerControlFunc"
import MakerCanvas from "./MakerCanvas"
import Info from "../Info"



// left canvas, right control
const Maker = (props) => {
    

    const [windowDims, setWindowDims] = useState({w: null, h: null})
    const [funcToShow, setFuncToShow] = useState(null)
    const [isMakingGraph, setIsMakingGraph] = useState(false)

    const debounce = (func, wait, immediate) => {
        var timeout;
        return () => {
            const context = null, args = null;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    const windowResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        setWindowDims({
            w: w,
            h: h
        })
    }
        
    window.addEventListener('resize', debounce(windowResize, 500, false))


    const handleIsMakingGraph = (bool) => {
        setIsMakingGraph(bool)
    }

    const handleChangeFunc = (func) => {
        setFuncToShow(func)
    }

    return (
        <div className="Maker-Container" style={{
            width: windowDims.w == null ? window.innerWidth : windowDims.w, 
            height: windowDims.h == null ? window.innerHeight : windowDims.h
            ,overflow: 'hide'
            }}>
            <Info/>
            <MakerCanvas 
            funcToShow={funcToShow}
            isMakingGraph={isMakingGraph}
            />
            <MakerControlFunc 
            isMakingGraph={handleIsMakingGraph}
            graphs={props.graphs}
            changeFunc={handleChangeFunc}
             />
        </div>
    )
}

export default Maker