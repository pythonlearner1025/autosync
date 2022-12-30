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
            <div ref={graphRef} className="saved-func" onClick={handleSelectFunc}>
                <p>{props.func.name}</p>
                <button className="button med" onClick={handleEdit}>edit</button>
            </div>
        </>
    )
}

export default Graph