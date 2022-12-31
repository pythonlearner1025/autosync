import React, { useState, useEffect, useRef } from 'react';
import MakerControlImporter from "./MakerControlImporter"
import MakerControlFunc from "./MakerControlFunc"
import "../comps.css"

const MakerControl = (props) => {
    const handleExit = (d) => {
        console.log('// MakerControl handleExit //')
        console.log(d)
        props.exit(d)
    }

    const handleGraphToShow = (g) => {
        props.graphToShow(g)
    }

    const handleAddGraph = (ginfo) => {
        props.addGraph(ginfo)
    }

    const handleIsMakingGraph = (bool) => {
        props.isMakingGraph(bool)
    }

    const handleChangeFunc= (func) => {
        props.changeFunc(func)
    }

    return (
       <div className="MakerControl-Container red">
            <MakerControlFunc exit={handleExit} 
            graphToShow={handleGraphToShow}
            addGraph={handleAddGraph}
            isMakingGraph={handleIsMakingGraph}
            graphs={props.graphs}
            availableTransforms={props.availableTransforms}
            changeFunc={handleChangeFunc}
             />
       </div> 
    )
}

export default MakerControl