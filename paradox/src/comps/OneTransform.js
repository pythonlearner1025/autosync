import React, { useState, useEffect, useRef } from 'react';
import { Text } from "@nextui-org/react";

/*
    TODO:
        - popup function creator? 
    FUNC:
        - add graph
        - add music
        
*/
const OneTransform = (props) => {
    const oneTransformRef = useRef(null)

    useEffect(() => {
        // Add a mouse dblclick event listener to the canvas
        oneTransformRef.current.style.cursor = 'pointer'
        oneTransformRef.current.addEventListener('dblclick', handleDoubleClick);

            // Remove the event listener when the component is unmounted
        return () => {
            oneTransformRef.current.removeEventListener('dblclick', handleDoubleClick);
            };
    }, []);

    // open Maker
    const handleDoubleClick = () => {
        props.openMaker()
    }

    // display transform
    const handleClick = () => {
        props.setActiveTransform(props.transformType)
    }

    return (
        <div ref={oneTransformRef} className={props.className} onClick={handleClick}>
            <Text h6>{props.transformType}</Text>
        </div>
    )
}

export default OneTransform