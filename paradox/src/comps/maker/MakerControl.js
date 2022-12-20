import React, { useState, useEffect, useRef } from 'react';
import MakerControlImporter from "./MakerControlImporter"
import MakerControlFunc from "./MakerControlFunc"

const MakerControl = (props) => {

    const handleAddData = (data) => {
        console.log('makerControl, got data')
        console.log(data)
        props.addData(data)
    }

    return (
       <div className="MakerControl-Container red">
            <MakerControlFunc addData={handleAddData}/>
       </div> 
    )
}

export default MakerControl