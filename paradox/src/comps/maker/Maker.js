import React, { useState, useEffect, useRef } from 'react';
import MakerControl from "./MakerControl"
import MakerCanvas from "./MakerCanvas"

// left canvas, right control
const Maker = (props) => {
    const [data, setData] = useState([])

    useEffect((()=>{
        console.log('maker, data update')
        console.log(data)
    }), [data])

    const handleAddData = (d) => {
        console.log('maker, got data')
        console.log(d)
        setData([...data, d])
    }
    return (
        <div className="Maker-Container purple">
            <MakerCanvas data={data}/>
            <MakerControl addData={handleAddData}/>
        </div>
    )
}

export default Maker