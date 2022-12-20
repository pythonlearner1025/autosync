import './comps.css'
import React, { useState, useEffect, useRef } from 'react';
import TransformCanvas from './TransformCanvas';
import TransformControl from './TransformControl'
import constant from "../config/constant"
import TransformCanvasTheme from '../themes/TransformCanvasTheme'
import TransformControlTheme from '../themes/TransformControlTheme'
import Container from "./Container"
import Maker from "./maker/Maker"
/*
 dim is horizontal, vertical stretch
 scale is unit scale
*/
const TransformBlock = (props) => {
    const [active, setActive] = useState({test: 'yes'});
    const [transforms, setTransforms] = useState({});
    const [toTweak, setToTweak] = useState({})
    // for now use dim from constant for test
    const [scale, setScale] = useState({})

    // drag logic
    const [dragging, setDragging] = useState(false)
    const [style, setStyle] = useState({top: 0, left: 0})
    const [starts, setStarts] = useState({})
    const containerRef = useRef(null);

    ////////////////////////////////////////////////////////////
    // drag 
    ////////////////////////////////////////////////////////////

    const handleMouseDown = (e) => {
        setDragging(true);
        setStarts({
            x: e.clientX, 
            y: e.clientY
        })
      }
    
    const handleMouseMove = (e) => {
        if (!dragging || props.fixed) return

        const dx = e.clientX - starts.x
        const dy = e.clientY - starts.y
       
        setStyle({
            top: style.top + dy,
            left: style.left + dx
        })
       
        setStarts({
            x: e.clientX,
            y: e.clientY
        })
    }

    const handleMouseUp = () => {
        setDragging(false)
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////

    useEffect(()=>{
        setScale(props.scale)
    }, [props.scale])

    const handleSetTweak = (res) => {
    // TODO: change the internal value of point
    setToTweak(res.point)
    }

    const handleOnTweak = (res) => {
    // TODO: change the value of toTweak, see if aliasing works
    }

    // adds transform to transforms
    const handleAddTransform = (transformType) => {
        // TODO: is this correct? change active in transforms.transformType
        setTransforms({...transforms[transformType], 'active': true})
    }

    const handleAddFunc = (res) => {
        const func = res.func
        const transformType = res.transformType
        // TODO: switch cases, find the right shit, and add func + points
    }
    
    // replace the div with a container too, eventually ~
    return (
    <div 
        style={style}
        onMouseDown={handleMouseDown} 
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="TransformBlock-Container"
    >
        <Maker/>
        <TransformControl
            active={active} 
            transforms={transforms}
            scale={scale}
            addTransform={handleAddTransform}
            addFunc={handleAddFunc}
            className="TransformControl"
            style={{color: TransformCanvasTheme.colors}}
        />
        <TransformCanvas 
            active={active} 
            transforms={transforms} 
            scale={scale}
            setTweak={handleSetTweak}
            onTweak={handleOnTweak}
            className="TransformCanvas"
            style={{color: TransformControlTheme.colors}}
        />
    </div>
    );
    };

    export default TransformBlock;