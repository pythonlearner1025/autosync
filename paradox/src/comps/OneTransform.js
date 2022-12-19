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
        <div className={props.className}>
            <Text h6>{props.transformType}</Text>
        </div>
    )
}

export default OneTransform