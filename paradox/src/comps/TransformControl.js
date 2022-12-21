import './comps.css'
import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from "@nextui-org/react";
import { Container, Row, Col } from '@nextui-org/react';
import constant from "../config/constant"
import OneTransform from "./OneTransform"

/*
    TODO: limit span to the transformContainerSpan
*/

const TransformControl = (props) => {
    const [selection, setSelection] = useState(Object.keys(constant.TransformTypes))
    const [selectedTransform, setSelectedTransform] = useState('')
    const [transforms, setTransforms] = useState([])
  
    useEffect(()=> {
    },[])
       // selected
    const onSelectionChange = (e) => {
        const [change] = e
        // parse e
        setSelectedTransform(change)

        // create new transform
        if (transforms.includes(change)) return
        setTransforms([... transforms, change])
        props.addTransformType(change)
    }

    // open maker
    const handleOpenMaker = () => {
        props.openMaker()
    }

    // add transform
    const handleSetActiveTransform = (transform_type) => {
        props.setActiveTransform(transform_type)
    }
    
    return (
        <Container  className="TransformControl-Container">
            <div className="test">
            </div>
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
                            openMaker={handleOpenMaker}
                            setActiveTransform={handleSetActiveTransform}
                            className={constant.TransformClassName[transform]}
                        />
                    )
                })}
            </div>
        </Container>
    )
}

export default TransformControl