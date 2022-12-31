import React, { useState, useEffect, useRef } from 'react';
import "../comps.css"

const Graph = (props) => {
    const graphRef = useRef(null)

    useEffect((()=> {
        graphRef.current.style.cursor = "pointer"
    }),[])

    const handleSelectFunc = () => {
        props.selectFunc(props.func.name)
    }

    const handleEdit = () => {
        props.edit(props.func.name)
    }

    const handleExport = () => {
        props.export(props.func.name)
    }


    return (
        <>
            <div ref={graphRef} className="saved-func" onClick={handleSelectFunc}>
                <p style={{left: 5, bottom: 0, position: 'absolute', overflow: 'hidden', maxWidth: 90}}>{props.func.name}</p>
                <button style={{marginLeft: 100}}className="button-func med" onClick={handleEdit}>edit</button>
                <button className="button-func med" onClick={handleExport}>export</button>
            </div>
        </>
    )
}

export default Graph