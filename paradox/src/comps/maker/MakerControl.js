import React, { useState, useEffect, useRef } from 'react';
import MakerControlImporter from "./MakerControlImporter"
import MakerControlFunc from "./MakerControlFunc"

const MakerControl = (props) => {

    const handleAddData = (data) => {
        console.log('makerControl, got data')
        console.log(data)
        props.addData(data)
    }

    const handleExit = (d) => {
        console.log('// MakerControl handleExit //')
        console.log(d)
        props.exit(d)
    }

    const handleDataToShow = (d) => {
        console.log('// MakerControl handleCanvasShow //')
        console.log(d)
        props.dataToShow(d)
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

    return (
       <div className="MakerControl-Container red">
            <MakerControlFunc exit={handleExit} 
            addData={handleAddData} 
            dataToShow={handleDataToShow}
            graphToShow={handleGraphToShow}
            addGraph={handleAddGraph}
            isMakingGraph={handleIsMakingGraph}
            graphs={props.graphs}
            availableTransforms={props.availableTransforms}
             />
       </div> 
    )
}

export default MakerControl