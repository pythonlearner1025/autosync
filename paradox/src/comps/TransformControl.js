import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from "@nextui-org/react";
import constant from "../config/constant"
import OneTransform from "./OneTransform"

/*
    TODO: limit span to the transformContainerSpan
*/

const TransformControl = (props) => {
    const [containerDim, setContainerDim] = useState(constant.TransformControl.containerDim)
    const [selection, setSelection] = useState(Object.keys(constant.TransformTypes))
    const [selectedTransform, setSelectedTransform] = useState('')
    const [transforms, setTransforms] = useState([])
    const containerRef = useRef(null); 
    const mouseRef = useRef(null);

    useEffect(() => {
        containerRef.current.style.width = `${containerDim.width}px`;
        containerRef.current.style.height = `${containerDim.height}px`;
    }, [containerDim])

    // create new div for transform
    useEffect(()=>{

    }, [selectedTransform])

    const handleMouseDown = (e) => {
        mouseRef.current = {
          x: e.clientX,
          y: e.clientY,
        };
        containerRef.current.addEventListener("mousemove", handleMouseMove);
        containerRef.current.addEventListener("mouseup", handleMouseUp);
    }
    const handleMouseMove = (e) => {
        const newWidth = containerDim.width + e.clientX - mouseRef.current.x;
        const newHeight = containerDim.height + e.clientY - mouseRef.current.y;
        mouseRef.current = {
            x: e.clientX,
            y: e.clientY,
        };
        setContainerDim({
            width: newWidth,
            height: newHeight,
        });
    }

    const handleMouseUp = () => {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
        containerRef.current.removeEventListener("mouseup", handleMouseUp);
    }

    // selected
    const onSelectionChange = (transformType) => {
        // parse e
        setSelectedTransform(transformType)

        // create new transform
        setTransforms(transforms.push(transformType))
        props.addTransform(transformType)
    }

    // add func to TransformBlock

    const handleAddFunc = (res) => {
        props.addFunc(res)
    }
    
    return (
        <div ref={containerRef} onMouseDown={handleMouseDown}>
            <Dropdown>
            <Dropdown.Button flat color="secondary" css={{ tt: "capitalize" }}>
                Add Transform 
            </Dropdown.Button>
            <Dropdown.Menu
                aria-label="Single selection actions"
                color="secondary"
                disallowEmptySelection
                selectionMode="single"
                onSelectionChange={onSelectionChange}
            >
            {selection.map((transform) => {
                return (
                    <Dropdown.Item key={transform}>{transform}</Dropdown.Item> 
                )
            })}
            </Dropdown.Menu>
            </Dropdown>
            <div className="transforms-listed">
                {transforms.map((transform) => {
                    return (
                        <OneTransform 
                            key={transform} 
                            transformType={transform}
                            addFunc={handleAddFunc}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default TransformControl