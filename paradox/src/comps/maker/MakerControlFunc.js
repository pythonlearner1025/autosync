import React, { useState, useEffect, useRef } from 'react';
import axios from "axios"
import Graph from "./Graph"
import "../comps.css"


const MakerControlFunc = (props) => {
    const [y, setY] = useState(null)
    const [t, setT] = useState(null)
    const [graphs, setGraphs] = useState([])
    const fpsRef = useRef(null)
    const bpmRef = useRef(null)
    const ampRef = useRef(null)
    const mp3Ref = useRef(null)
    const audioCtxRef = useRef(null)
    const exitDivRef = useRef(null)
    const nameRef = useRef(null)
    const transformRef = useRef(null)
    const [isMakingGraph, setIsMakingGraph] = useState(false)
    const [workingName, setWorkingName] = useState(null)
    const [workingTransform, setWorkingTransform] = useState(null)

    useEffect((()=> {
        exitDivRef.current.style.cursor = 'pointer'
    }),[])

    useEffect((()=>{
        //console.log(graphs)
        //console.log(props.graphs)
        setGraphs([...props.graphs])
    }), [props.graphs])

  
    const handleFileInput = (e) => {
        console.log(e)
        const audioCtx = audioCtxRef.current
        var files = e.target.files
        var reader = new FileReader()
        reader.onload = async (e)=> {
            var buff = await audioCtx.decodeAudioData(e.target.result)
            processAudio(buff)
        }
        reader.readAsArrayBuffer(files[0])
    }

    // from here, either directly set points, 
    // OR send to server for processing
    const processAudio = (buff) => {
        var length = buff.length
        var duration = buff.duration
        var hz = buff.sampleRate
        var ch1 = buff.getChannelData(0)

        var data = []
        //console.log(duration*hz, ch1.length)
        // send 5 seconds
        for (let i=hz*30; i<hz*40; i++){
            data.push(ch1[i])
        }
        //console.log(data.length)
        sendAudioData(data, hz)
    }


    const sendAudioData = (ch1, sr) => {
        axios.post("http://localhost:8000/api/audio-data", {
            audioData: ch1,
            sr: sr
        }).then(resp => {
            console.log(resp)
            setT(JSON.parse(resp.data.t))
            setY(JSON.parse(resp.data.y))
        })
    }

    const sendTestData = (data) => {
        axios.post("http://localhost:8000/api/test-data", {
            testData: data
        }).then(resp => {
            console.log(resp)
            console.log(resp.data.data)
        })
    } 

    useEffect(() => {
        if (!isMakingGraph) return
        audioCtxRef.current = new AudioContext()
        mp3Ref.current.addEventListener("input", handleFileInput)
    }, [isMakingGraph])

    const handleFpsChange = (e) => {
        fpsRef.current.value = e.target.value 
    }
    const handleBpmChange = (e) => {
        bpmRef.current.value = e.target.value 

    }
    const handleAmpChange = (e) => {
        ampRef.current.value = e.target.value 
        sendTestData(e.target.value)
    }

    const handleExit = (e) => {
        console.log('exit', e)
        props.exit(e)
    }

    const handleMakeGraph = (e) => {
        setIsMakingGraph(true)
        props.isMakingGraph(true)
    }

    const handleNameSubmit = (e) => {
        e.preventDefault() 
        console.log(nameRef.current.value)
        setWorkingName(nameRef.current.value)
    }
      // add New Graph
    useEffect((()=> {
        if (!y || !t) return
        const data ={
            t: t,
            y: y
        }
        props.dataToShow(data)
    }), [t,y])


    const handleAddGraph = () => {
       
        if (!workingName) {
            alert('pls add name')
            return
        } else if (!t || !y){
            alert('pls add data')
            return
        } 
        setT(null)
        setY(null)
        setIsMakingGraph(false)
        props.isMakingGraph(false)

        //TODO: replace this when add support for adding transform type in Maker
      
        props.addGraph({
            name: workingName,
            transform: null 
        })
        setWorkingName(null)
        setWorkingTransform(null)
    }

    const handleAddGraphExit = () => {
        setT(null)
        setY(null)
        setWorkingName(null)
        setWorkingTransform(null)
        setIsMakingGraph(false)
        props.isMakingGraph(false)
    }

    // select graph to show, send to canvas
    const handleSelectGraph = (name) => {
        const toShow = graphs.filter(g => {
            return g.name == name
        })
        //console.log('// makercontrolfunc, handleSelectGraph //')
        //console.log(graphs)
        //console.log(toShow)
        props.graphToShow(toShow[0])
    }

    const handleTransformChange = (newG) => {
        const updated = []
        graphs.map(g=>{
            var addG = g
            if (addG.name == newG.name) addG.transform = newG.transform
            updated.push(addG)
        })
        setGraphs(updated)
    }

   
    return (
        <div className="MakerControlFunc-Container yellow">
            <div style={{justifyText: "center", display: 'flex'}}>
                <div style={{width: '90%'}}>f(x)</div>
                <div style={{justifyText: 'right', backgroundColor: "gray"}} 
                ref={exitDivRef}
                onClick={handleExit}
                >X</div>
            </div>
            {(()=>{
                if (!isMakingGraph && !graphs) {
                    return (
                        <div>No graphs</div>
                    )
                }   else if (!isMakingGraph && graphs) {
                    return (
                        <>
                            <div>
                                <button onClick={handleMakeGraph}>Make New</button>
                            </div>
                            <div>
                            </div>
                            <div>
                                {
                                    graphs.map(g => {
                                        return (
                                            <ul>
                                                <Graph 
                                                key={g.name} 
                                                graph={g} 
                                                selectGraph={handleSelectGraph}
                                                changeTransform={handleTransformChange}
                                                availableTransforms={props.availableTransforms}/>
                                            </ul>
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                } else {
                    return (
                        <> 
                            <div className="input-container">
                                <label for="name">name</label>
                                <form onSubmit={handleNameSubmit}>
                                    <input ref={nameRef} name="name" className="input" type="text"></input> 
                                </form>
                            </div>
                            <div className="input-container">
                                <label for="mp3">mp3</label>
                                <input ref={mp3Ref} name="mp3" className="input" type="file"></input> 
                            </div>
                            <div className="input-container">
                                <label for="fps">fps</label>
                                <input ref={fpsRef} name="fps" className="input" type="number" 
                                onChange={handleFpsChange}></input> 
                            </div>
                            <div className="input-container">
                                <button className="button" onClick={handleAddGraph}>add graph</button>
                                <button className="button" onClick={handleAddGraphExit}>exit</button>
                            </div>
                        </>
                    )
                }
            })()}
        </div>
    )
}

export default MakerControlFunc