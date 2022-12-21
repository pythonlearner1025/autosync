import React, { useState, useEffect, useRef } from 'react';
import "../comps.css"

const Graph = (props) => {
    const graphRef = useRef(null)
    const transformRef = useRef(null)
    const [initial, setInitial] = useState('N/A')

    useEffect((()=> {
        graphRef.current.style.cursor = "pointer"
        console.log(props.graph.transform)
        if (props.graph.transform) setInitial(props.graph.transform)
    }),[])

    const handleSelectGraph = () => {
        props.selectGraph(props.name)
    }

    const handleTransformChange = () => {
        const new_t = transformRef.current.options[transformRef.current.selectedIndex].value
        const newG = props.graph
        newG.transform = new_t
        props.changeTransform(newG)
    }

    return (
        <>
            <div>
                <div ref={graphRef} className="Graph" onClick={handleSelectGraph}>{props.graph.name}</div>
                <label for="transform">transform</label>
                    <select ref={transformRef} onChange={handleTransformChange}>
                        <option value={initial}>{initial}</option>
                        {props.availableTransforms.map(t => {
                            if (t != initial) {
                                return(
                                    <option key={t} value={t}>{t}</option>
                                )
                            }
                       })}
                </select>
            </div>
        </>
    )
}

export default Graph