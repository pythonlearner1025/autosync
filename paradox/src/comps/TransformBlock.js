import './comps.css'
import React, { useState, useEffect, useRef } from 'react';
import TransformCanvas from './TransformCanvas';
import TransformControl from './TransformControl'
import constant from "../config/constant"
import TransformCanvasTheme from '../themes/TransformCanvasTheme'
import TransformControlTheme from '../themes/TransformControlTheme'
/*
 dim is horizontal, vertical stretch
 scale is unit scale
*/
const TransformBlock = (props) => {
    const [active, setActive] = useState({});
    const [transforms, setTransforms] = useState({});
    const [toTweak, setToTweak] = useState({})
    // for now use dim from constant for test
    const [containerDim, setContainerDim] = useState(
        constant.TransformContainer.containerDim
        )
    const [scale, setScale] = useState({})
    const containerRef = useRef(null);
    const mouseRef = useRef({});

    ////////////////////////////////////////////////////////////
    // when dim changes
    ////////////////////////////////////////////////////////////
    useEffect(()=>{
    //TODO: for each transform, add points
        containerRef.current.style.width = `${containerDim.width}`
        containerRef.current.style.height = `${containerDim.height}`

    }, [containerDim])

    const handleMouseDown = (e) => {
        mouseRef.current = {
          x: e.clientX,
          y: e.clientY,
        };
        containerRef.current.addEventListener("mousemove", handleMouseMove);
        containerRef.current.addEventListener("mouseup", handleMouseUp);
      }
    
    const handleMouseMove = (e) => {
        const newWidth = containerDim.width + e.clientX - mouseRef.current.x;
        const newHeight = containerDim.height + e.clientY - mouseRef.current.y;
        mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        };
        setContainerDim({
        width: newWidth,
        height: newHeight,
        });
    }

    const handleMouseUp = () => {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
        containerRef.current.removeEventListener("mouseup", handleMouseUp);
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
     
    return (
    <div ref={containerRef} onMouseDown={handleMouseDown} className="TransformBlock-Container">
        <TransformControl
            active={active} 
            transforms={transforms}
            transformDim={containerDim}
            scale={scale}
            addTransform={handleAddTransform}
            addFunc={handleAddFunc}
            className="TransformControl"
            style={{color: TransformCanvasTheme.colors}}
        />
        <TransformCanvas 
            active={active} 
            transforms={transforms} 
            transformDim={containerDim}
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