import React, { useState, useEffect, useRef } from 'react';
import MakerControlFunc from "./MakerControlFunc"
import MakerCanvas from "./MakerCanvas"

const testTransforms = [
    't_x', 't_y', 't_z'
]

// left canvas, right control
const Maker = (props) => {
    

    const [windowDims, setWindowDims] = useState({w: null, h: null})
    const [availableTransforms, setAvailableTransforms] = useState(testTransforms)
    const [funcToShow, setFuncToShow] = useState(null)
    const [graphToShow, setGraphToShow] = useState(null)
    const [graphs, setGraphs] = useState([])
    const [addGraph, setAddGraph] = useState(false)
    const [isMakingGraph, setIsMakingGraph] = useState(false)
    const [workingGraph, setWorkingGraph] = useState(null)

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
        console.log(w, h)
        setWindowDims({
            w: w,
            h: h
        })
    }
        
    window.addEventListener('resize', debounce(windowResize, 500, false))


    const handleExit = (d) => {
        //console.log('// Maker handleExit //')
        //console.log(d)
        console.log(graphs)
        props.exit(graphs)
    }

    const handleGraphToShow = (g) => {
        //console.log('// Maker handleGraphToShow//')
        console.log(g)
        setFuncToShow(g)
    }

    const handleAddGraph = (newg) => {
        setGraphs([...graphs, newg])
    }

    // when Add graph triggered,
    // make New Graph
    const handleReturnGraph = (data) => {
        const graph = {
            name: workingGraph.name,
            t: data.t,
            y: data.y,
            transform: workingGraph.transform
        }
        setGraphs([...graphs, graph])
    }

    const handleIsMakingGraph = (bool) => {
        setIsMakingGraph(bool)
    }

    const handleChangeFunc = (func) => {
        setFuncToShow(func)
    }

    return (
        <>
        <div className="Maker-Container" style={{
            width: windowDims.w == null ? window.innerWidth : windowDims.w, 
            height: windowDims.h == null ? window.innerHeight : windowDims.h
            }}>
            <MakerCanvas 
            funcToShow={funcToShow}
            graphToShow={graphToShow}
            addGraph={addGraph}            
            returnGraph={handleReturnGraph}
            isMakingGraph={isMakingGraph}
            workingGraph={workingGraph}
            />
            <MakerControlFunc exit={handleExit} 
            graphToShow={handleGraphToShow}
            addGraph={handleAddGraph}
            isMakingGraph={handleIsMakingGraph}
            graphs={props.graphs}
            availableTransforms={props.availableTransforms}
            changeFunc={handleChangeFunc}
             />
        </div>
        </>
        
    )
}

export default Maker