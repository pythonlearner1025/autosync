import React, { useState, useEffect, useRef } from 'react';
import MakerControl from "./MakerControl"
import MakerCanvas from "./MakerCanvas"

// left canvas, right control
const Maker = (props) => {
    const [data, setData] = useState([])
    const [dataToShow, setDataToShow] = useState(null)
    const [graphToShow, setGraphToShow] = useState(null)
    const [graphs, setGraphs] = useState([])
    const [addGraph, setAddGraph] = useState(false)
    const [isMakingGraph, setIsMakingGraph] = useState(false)
    const [workingGraph, setWorkingGraph] = useState(null)

    // load TransformBlock graphs
    useEffect((()=>{
        console.log('mount Maker')
        console.log(graphs)
        console.log(props.graphs)
        setGraphs([...graphs, ...props.graphs])
    }),[])

    const handleAddData = (d) => {
        //console.log('maker, got data')
        //console.log(d)
        setData([...data, d])
    }

    const handleExit = (d) => {
        //console.log('// Maker handleExit //')
        //console.log(d)
        console.log(graphs)
        props.exit(graphs)
    }

    const handleDataToShow = (d) => {
        //console.log('// Maker handleExit //')
        //console.log(d)
        // send over only Data
        setDataToShow(d)
    }

    const handleGraphToShow = (g) => {
        //console.log('// Maker handleGraphToShow//')
        const graph2show = graphs.filter(graph => {
            return graph.name == g.name
        })
        //console.log(graph2show[0])
        setGraphToShow(graph2show[0])
    }

    const handleAddGraph = (graphInfo) => {
        setWorkingGraph(graphInfo)
    }

    // when Add graph triggered,
    // make New Graph
    const handleReturnGraph = (data) => {

        console.log('handleReturnGraph')
        console.log(data)
        const graph = {
            name: workingGraph.name,
            t: data.t,
            y: data.y,
            transform: workingGraph.transform
        }
        console.log(graph)
        console.log(graphs)
        setGraphs([...graphs, graph])
    }

    const handleIsMakingGraph = (bool) => {
        console.log('ismakinggraph', bool)
        setIsMakingGraph(bool)
    }


    return (
        <div className="Maker-Container purple">
            <MakerCanvas 
            data={data}
            dataToShow={dataToShow}
            graphToShow={graphToShow}
            addGraph={addGraph}            
            returnGraph={handleReturnGraph}
            isMakingGraph={isMakingGraph}
            workingGraph={workingGraph}
            />
            <MakerControl 
            addData={handleAddData}
            addGraph={handleAddGraph}
            dataToShow={handleDataToShow}
            graphToShow={handleGraphToShow}
            exit={handleExit}
            isMakingGraph={handleIsMakingGraph} 
            graphs={graphs}
            availableTransforms={props.availableTransforms}
            />
        </div>
    )
}

export default Maker