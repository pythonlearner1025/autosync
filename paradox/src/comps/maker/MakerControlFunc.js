import React, { useState, useEffect, useRef } from 'react';
import axios from "axios"
import Graph from "./Graph"
import "../comps.css"
import min from "../../assets/download.svg"

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
    funcType: undefined, 
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
    const funcTypeRef = useRef(null)
    const omegaRef = useRef(null)
    const offsetRef = useRef(null)
    const audioCtxRef = useRef(null)
    const nameRef = useRef(null)
    
    // visuals
    const [minimize, setMinimize] = useState(false)
    const [position, setPosition] = useState({x:0, y:0})

    const handleMove = (event) => {
        console.log('h')
        const currentX = event.clientX;
        const currentY = event.clientY;
        const initialX = position.x;
        const initialY = position.y;
        const xOffset = currentX - initialX;
        const yOffset = currentY - initialY;
    
        const handleMouseMove = (event) => {
          event.preventDefault();
          setPosition({
            x: event.clientX - xOffset,
            y: event.clientY - yOffset,
          });
        };
    
        const handleMouseUp = () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
    
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };


    useEffect((()=> {
        if (!initFunc) return
        const newFunc = {
            fps: initFunc.fps,
            bpm: initFunc.bpm,
            amp: initFunc.amp,
            funcType: initFunc.funcType, 
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
        if (workingName)  nameRef.current.value = workingName
        console.log(bpmRef, ampRef, omegaRef, funcTypeRef, offsetRef)
        bpmRef.current.value = f.bpm
        ampRef.current.value = f.amp
        omegaRef.current.value = f.omega
        funcTypeRef.current.value = f.funcType
        offsetRef.current.value = f.offset
    }

    useEffect((()=> {
        props.changeFunc(workingFunc)
    }), [
            workingFunc.amp, 
            workingFunc.bpm,
            workingFunc.fps,
            workingFunc.omega,
            workingFunc.funcType,
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
        console.log('here')
        if (!isMakingGraph) return
        audioCtxRef.current = new AudioContext()
        mp3Ref.current.addEventListener("input", handleFileInput)
    }, [isMakingGraph])


    const handleEditSave = () => {
        console.log('// save //')
        console.log(funcs)
        console.log(workingName)
        console.log(workingFunc)

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
            setWorkingName(null)
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

    const handleFuncTypeChange = (e) => {
        const funcType = e.target.value
        console.log(funcType)
        funcTypeRef.current.value = funcType
        setWorkingFunc({...workingFunc, funcType:funcType})
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

    const handleMinMax = () => {
        setMinimize(!minimize)
    }

    if (minimize) {
        return (
            <div 
            onMouseDown={handleMove} 
            className="MakerControlFunc-Minimized med"
            style={{
                top: position.y,
                right: -position.x
            }}
            >
                  <img 
                    style={{paddingTop: 5, paddingRight: 5}}
                    className='max' 
                    src={min} 
                    width='15px' 
                    height='15px'
                    onClick={handleMinMax}
                    />
            </div>
        )
    } else return (
                <div onMouseDown={handleMove} 
                className="MakerControlFunc-Container background"
                style={{
                    top: position.y,
                    right: -position.x
                }} 
                >
                    
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
                                    <div className='tool-header header-font med'>
                                        <p style={{paddingRight: 90, paddingLeft: 5}}>All Functions</p>
                                        <img 
                                        style={{paddingTop: 5, paddingRight: 5}}
                                        className='min' 
                                        src={min} 
                                        width='15px' 
                                        height='15px'
                                        onClick={handleMinMax}
                                        />
                                    </div>
                                    <button className="button high makenew" onClick={handleMakeGraph}>Make New</button>
                                    <div>
                                    </div>
                                    <div>
                                        {   
                                            funcs.map((f,i) => {
                                                return (
                                                    <ul style={{paddingTop: i==0?0:30}}>
                                                        <Graph 
                                                        key={i} 
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
                                    <div className='tool-header header-font med'>
                                        <p style={{paddingRight: 90, paddingLeft: 5}}>Function Creator</p>
                                        <img 
                                        style={{paddingTop: 5, paddingRight: 5}}
                                        className='min' 
                                        src={min} 
                                        width='15px' 
                                        height='15px'
                                        onClick={handleMinMax}
                                        />
                                    </div>

                                    <div className="inputs">
                                        <div className="input-container control-font">
                                            <label className="label">name</label>
                                            <form onSubmit={handleNameSubmit}>
                                                <input ref={nameRef} name="name" className="input" type="text"></input> 
                                            </form>
                                        </div>
                                        <div className="input-container control-font">
                                            <label className="label">mp3</label>
                                            <input ref={mp3Ref} name="mp3" title=" /" className="input" type="file"></input> 
                                        </div>
                                        <div className="input-container control-font">
                                            <label className="label">func type:</label>
                                            <div>
                                                <select name="type" className="select low" ref={funcTypeRef} onChange={handleFuncTypeChange}>
                                                    <option value="sin">sin</option>
                                                    <option value="saw">saw</option>
                                                </select> 
                                            </div>
                                        </div>
                                    
                                        <div className="input-container control-font">
                                            <label className="label">amp</label>
                                            <input ref={ampRef} name="amp" className="input" type="number" 
                                            onChange={handleAmpChange}
                                            ></input> 
                                        </div>
                                        <div className="input-container control-font">
                                            <label className="label">period</label>
                                            <input ref={omegaRef} name="omega" className="input" type="number" 
                                            onChange={handleOmegaChange}
                                            ></input> 
                                        </div>
                                        
                                        <div className="input-container control-font">
                                            <label className="label">offset</label>
                                            <input ref={offsetRef} name="offset" className="input" type="number" 
                                            onChange={handleOffsetChange}
                                            ></input> 
                                        </div>
                                    </div>
                                    <div className="stats header-font med">
                                        <p style={{marginLeft: 5}}>Stats</p>
                                    </div>
                                     <div className="input-container control-font">
                                            <label className="label" ref={bpmRef}>bpm: {workingFunc.bpm != undefined ? workingFunc.bpm : ''}</label>
                                    </div>

                                    <div className="controls">
                                        <div className="input-container">
                                            <button className="button low" onClick={handleShowBeats}>show beats</button>
                                        </div>
                                        <div className="input-container">
                                            <button className="button low" onClick={handleRestoreDefault}>restore default</button>
                                        </div>
                                        <div className="input-container">
                                            <button className="button high" onClick={handleEditSave}>save</button>
                                            <button className="button high" onClick={handleEditExit}>exit</button>
                                        </div>
                                    </div>
                            </>
                            )
                        }
                    })()}
                </div>
            )
    
    
}

export default MakerControlFunc