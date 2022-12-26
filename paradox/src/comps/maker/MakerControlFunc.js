import React, { useState, useEffect, useRef } from 'react';
import axios from "axios"
import Graph from "./Graph"
import "../comps.css"

/*
 TODO:

 * add duration
 * add rhythm (remove phase, omega, offset)
 * add clip
 * add export
 * css
*/

const initWorkingFunc ={
    fps: undefined,
    bpm: undefined,
    amp: undefined,
    phase: undefined, 
    omega: undefined,
    offset: undefined,
    showBeats: false,
} 

const MakerControlFunc = (props) => {
    const [funcs, setFuncs] = useState([])
    const [isMakingGraph, setIsMakingGraph] = useState(false)
    const [initFunc, setInitFunc] = useState(null)
    const [workingName, setWorkingName] = useState(null)
    const [workingFunc, setWorkingFunc] = useState(initWorkingFunc)

    // refs
    const fpsRef = useRef(null)
    const bpmRef = useRef(null)
    const ampRef = useRef(null)
    const mp3Ref = useRef(null)
    const phaseRef = useRef(null)
    const omegaRef = useRef(null)
    const offsetRef = useRef(null)
    const audioCtxRef = useRef(null)
    const nameRef = useRef(null)

    useEffect((()=> {
        if (!initFunc) return
        const newFunc = {
            fps: initFunc.fps,
            bpm: initFunc.bpm,
            amp: initFunc.amp,
            phase: initFunc.phase, 
            omega: initFunc.omega,
            beats: initFunc.beats,
            offset: initFunc.offset,
            showBeats: false,    
        }
        setWorkingFunc(newFunc)
        setRefs(initFunc)
        props.changeFunc(newFunc)
    }), [initFunc])

    const setRefs = (f) => {
        if (workingName) nameRef.current.value = workingName
        bpmRef.current.value = f.bpm
        ampRef.current.value = f.amp
        omegaRef.current.value = f.omega
        phaseRef.current.value = f.phase
        offsetRef.current.value = f.offset
    }

    useEffect((()=> {
        props.changeFunc(workingFunc)
    }), [
            workingFunc.amp, 
            workingFunc.bpm,
            workingFunc.fps,
            workingFunc.omega,
            workingFunc.phase,
            workingFunc.showBeats,
            workingFunc.offset
    ])

  
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
        // send 10 seconds
        for (let i=0; i<hz*100; i++){
            data.push(ch1[i])
        }
        console.log(hz)
        sendAudioData(data, 22050)
    }


    const sendAudioData = (ch1, sr) => {
        axios.post("http://localhost:8000/api/audio-data", {
            audioData: ch1,
            sr: sr
        }).then(resp => {
            console.log(resp)
            setInitFunc(JSON.parse(resp.data.fitted))
        })
    }

    useEffect(() => {
        if (!isMakingGraph) return
        audioCtxRef.current = new AudioContext()
        mp3Ref.current.addEventListener("input", handleFileInput)
    }, [isMakingGraph])


    const handleEditSave = () => {

        const doesExist = (() => {
            const found = funcs.filter(f=>{
                return f.name == workingName
            })
            return found.length > 0 
        })()


        if (!workingName) {
            alert('pls add name')
            return
        } 

        setIsMakingGraph(false)
        props.isMakingGraph(false)
        if (doesExist) {
            const newFuncs = []
            funcs.map(f=>{
                if (f.name != workingName) newFuncs.push(f)
                else {
                    const f = workingFunc
                    console.log(workingFunc)
                    f.name = workingName
                    newFuncs.push(f)
                }
            })
            setFuncs(newFuncs)
            setWorkingFunc(initWorkingFunc)
        } else {
            const f = workingFunc
            f.name = workingName
            props.addGraph(f)
            setFuncs([...funcs, f])
            setWorkingName(null)
            setWorkingFunc(initWorkingFunc)
        }
    }

    const handleEditExit = () => {
        setWorkingName(null)
        setIsMakingGraph(false)
        props.isMakingGraph(false)
    }

    // select func to show, send to canvas
    const handleSelectFunc = (name) => {
        const toShow = funcs.filter(f => {
            return f.name == name
        })
        console.log(toShow)
        //console.log('// makercontrolfunc, handleSelectGraph //')
        //console.log(graphs)
        //console.log(toShow)
        props.graphToShow(toShow[0])
    }

    
    const handleFpsChange = (e) => {
        const fps = e.target.value
        fpsRef.current.value = fps 
        setWorkingFunc({...workingFunc, fps:fps})
    }

    const handleBpmChange = (e) => {
        const bpm = e.target.value
        bpmRef.current.value = bpm 
        setWorkingFunc({...workingFunc, bpm:bpm})

    }
    const handleAmpChange = (e) => {
        console.log('ampChange!')
        const amp = e.target.value
        ampRef.current.value = amp 
        console.log(amp)
        setWorkingFunc({...workingFunc, amp:amp})
    }

    const handleOmegaChange = (e) => {
        const omega = e.target.value
        omegaRef.current.value = omega
        setWorkingFunc({...workingFunc, omega:omega})
    }

    const handlePhaseChange = (e) => {
        const phase = e.target.value
        phaseRef.current.value = phase
        setWorkingFunc({...workingFunc, phase:phase})
    }

    const handleOffsetChange = (e) => {
        const offset = e.target.value
        offsetRef.current.value = offset
        setWorkingFunc({...workingFunc, offset:offset})
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

    const handleRestoreDefault = () => {
        setWorkingFunc(initFunc)
        setRefs(initFunc)
    }

    const handleShowBeats = () => {
        setWorkingFunc({...workingFunc, showBeats: !workingFunc.showBeats})
    }
    
    const handleEdit = (name) => {
        const toEdit = funcs.filter(f=> {
            return f.name == name
        })[0]
        setIsMakingGraph(true)
        setInitFunc(toEdit)
        setWorkingName(name)
    }
   
    return (
        <div className="MakerControlFunc-Container yellow">
            <div style={{justifyText: "center", display: 'flex'}}>
            </div>
            {(()=>{
                if (!isMakingGraph && !funcs) {
                    return (
                        <div>No graphs</div>
                    )
                }   else if (!isMakingGraph && funcs) {
                    return (
                        <>
                            <div>
                                <button onClick={handleMakeGraph}>Make New</button>
                            </div>
                            <div>
                            </div>
                            <div>
                                {
                                    funcs.map(f => {
                                        return (
                                            <ul>
                                                <Graph 
                                                key={f.name} 
                                                func={f} 
                                                selectFunc={handleSelectFunc}
                                                availableTransforms={props.availableTransforms}
                                                edit={handleEdit}
                                                />
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
                                <label for="bpm">bpm</label>
                                <input ref={bpmRef} name="bpm" className="input" type="number" 
                                onChange={handleBpmChange}
                                ></input> 
                            </div>
                            <div className="input-container">
                                <label for="amp">amp</label>
                                <input ref={ampRef} name="amp" className="input" type="number" 
                                onChange={handleAmpChange}
                                ></input> 
                            </div>
                            <div className="input-container">
                                <label for="omega">omega</label>
                                <input ref={omegaRef} name="omega" className="input" type="number" 
                                onChange={handleOmegaChange}
                                ></input> 
                            </div>
                            <div className="input-container">
                                <label for="phase">phase</label>
                                <input ref={phaseRef} name="phase" className="input" type="number" 
                                onChange={handlePhaseChange}
                                ></input> 
                            </div>
                            <div className="input-container">
                                <label for="offset">offset</label>
                                <input ref={offsetRef} name="offset" className="input" type="number" 
                                onChange={handleOffsetChange}
                                ></input> 
                            </div>
                            <div className="input-container">
                                <button className="button" onClick={handleShowBeats}>show beats</button>
                            </div>
                            <div className="input-container">
                                <button className="button" onClick={handleRestoreDefault}>restore default</button>
                            </div>
                            <div className="input-container">
                                <button className="button" onClick={handleEditSave}>save</button>
                                <button className="button" onClick={handleEditExit}>exit</button>
                            </div>
                        </>
                    )
                }
            })()}
        </div>
    )
}

export default MakerControlFunc