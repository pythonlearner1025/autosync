import React, { useState, useEffect, useRef } from 'react';
import { Text } from "@nextui-org/react";

/*
    FUNC:
        - add graph
        - add music
        - popup function creator? 
        
*/
const OneTransform = (props) => {
    return (
        <>
            <Text h6>{props.transformtype}</Text>
        </>
    )
}

export default OneTransform