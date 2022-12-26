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


    return (
        <>
            <div>
                <div ref={graphRef} className="Graph" onClick={handleSelectFunc}>{props.func.name}</div>
                <div>
                    <button onClick={handleEdit}>edit</button>
                </div>
            </div>
        </>
    )
}

export default Graph