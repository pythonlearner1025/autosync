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
    const [availableTransforms, setAvailableTransforms] = useState([])
    const [activeTransform, setActiveTransform] = useState(null);
    const [toTweak, setToTweak] = useState({})
    // for now use dim from constant for test
    const [scale, setScale] = useState({})

    // drag logic
    const [dragging, setDragging] = useState(false)
    const [style, setStyle] = useState({top: 0, left: 0})
    const [starts, setStarts] = useState({})
    const [graphs, setGraphs] = useState([])
    const [toggleMaker, setToggleMaker] = useState(false)

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
    const handleSetActiveTransform = (active_transform) => {
        // TODO: is this correct? change active in transforms.transformType
        setActiveTransform(active_transform)
    }
  
    // only add new graphs 
    const handleMakerExit = (exit_graphs) => {
        console.log('// TransformBlock handleMakerExit//')
        console.log(exit_graphs)
        console.log(graphs)
        const newGraphs = []
        exit_graphs.map(g => {
            if (!graphs.includes(g)) newGraphs.push(g)
        })
        console.log(newGraphs)
        setGraphs([...graphs,...newGraphs])
        setToggleMaker(!toggleMaker)
    }

    const handleAddTransformType = (transform_t) => {
        setAvailableTransforms([...availableTransforms, transform_t])
    }

    const handleOpenMaker = () => {
        setToggleMaker(!toggleMaker)
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
        {(()=> {
            if (toggleMaker) return (
                <Maker 
                exit={handleMakerExit}
                availableTransforms={availableTransforms}
                graphs={graphs}
                />
            )
        })()}
        <TransformControl
            scale={scale}
            setActiveTransform={handleSetActiveTransform}
            addTransformType={handleAddTransformType}
            openMaker={handleOpenMaker}
            className="TransformControl"
            style={{color: TransformCanvasTheme.colors}}
        />
        <TransformCanvas 
            graphs={graphs}
            activeTransform={activeTransform} 
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