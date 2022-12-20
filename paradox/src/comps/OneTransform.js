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

    const [show, setShow] = useState(false)
    const oneTransformRef = useRef(null)

    const handleDoubleClick = () => {
        setShow(true)
    }

    useEffect(() => {
        
    }, [show])

    useEffect(() => {
        // Add a mouse dblclick event listener to the canvas
        oneTransformRef.current.addEventListener('dblclick', handleDoubleClick);

            // Remove the event listener when the component is unmounted
        return () => {
            oneTransformRef.current.removeEventListener('dblclick', handleDoubleClick);
            };
    }, []);

    return (
        <div ref={oneTransformRef} className={props.className}>
            <Text h6>{props.transformType}</Text>
        </div>
    )
}

export default OneTransform