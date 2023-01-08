import React, { useState, useEffect, useRef } from 'react';
import axios from "axios"
import Graph from "./Graph"
import "../comps.css"
import min from "../../assets/download.svg"
import parser from "../../funcs/parser"
import toString from "../../funcs/toString"

/*
 TODO:

 * add duration
 * add rhythm (remove phase, omega, offset)
 * add clip
 * add export
 * css
*/

const initWorkingFunc ={
    bpm: undefined,
    amp: undefined,
    funcType: undefined, 
    omega: undefined,
    offset_x: undefined,
    offset_y: undefined,
    showBeats: false,
} 



const MakerControlFunc = (props) => {
    const [funcs, setFuncs] = useState([])
    const [isMakingGraph, setIsMakingGraph] = useState(false)
    const [initFunc, setInitFunc] = useState(null)
    const [workingFunc, setWorkingFunc] = useState(initWorkingFunc)
    // export stuff
    const [isExportMode, setIsExportMode] = useState(false)
    const [exportFps, setExportFps] = useState(null)
    const [exportDuration, setExportDuration] = useState(null)
    const [exportFunc, setExportFunc] = useState(null)

    // refs
    const fpsRef = useRef(null)
    const durationRef = useRef(null)
    const bpmRef = useRef(null)
    const ampRef = useRef(null)
    const mp3Ref = useRef(null)
    const funcTypeRef = useRef(null)
    const omegaRef = useRef(null)
    const offsetXRef = useRef(null)
    const offsetYRef = useRef(null)
    const exportFuncRef = useRef(null)
    
    const audioCtxRef = useRef(null)
    const nameRef = useRef(null)
    const exportRef = useRef(null)
    // export stuff
    
    // visuals
    const [minimize, setMinimize] = useState(false)
    const [position, setPosition] = useState({x:0, y:0})

    const handleMove = (event) => {
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
            name: initFunc.name,
            fps: initFunc.fps,
            bpm: initFunc.bpm,
            amp: initFunc.amp,
            funcType: initFunc.funcType, 
            omega: initFunc.omega,
            beats: initFunc.beats,
            offset_x: initFunc.offset_x,
            offset_y: initFunc.offset_y,
            showBeats: false,    
        }
        
        setWorkingFunc(newFunc)
        setRefs(initFunc)
        props.changeFunc(newFunc)
    }), [initFunc])

    const setRefs = (f) => {
        
        nameRef.current.value = f.name
        bpmRef.current.value = f.bpm
        ampRef.current.value = f.amp
        omegaRef.current.value = f.omega
        funcTypeRef.current.value = f.funcType
        offsetXRef.current.value = f.offset_x
        offsetYRef.current.value = f.offset_y
        
    }

    useEffect((()=> {
        props.changeFunc(workingFunc)
    }), [
            workingFunc.amp, 
            workingFunc.bpm,
            workingFunc.omega,
            workingFunc.funcType,
            workingFunc.showBeats,
            workingFunc.offset_x,
            workingFunc.offset_y
    ])

  
    const handleFileInput = (e) => {
        
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
        //
        // send 10 seconds
        console.time('api')
        for (let i=0; i<ch1.length; i++){
            data.push(ch1[i])
        }
        
        sendAudioData(data, 22050)
    }


    const sendAudioData = (ch1, sr) => {
        axios.post("http://localhost:8000/api/audio-data", {
            audioData: JSON.stringify(ch1),
            sr: sr
        }).then(resp => {
            console.timeEnd('api')
            const data = JSON.parse(resp.data.fitted)
            data.name = nameRef.current.value
            data.offset_x = 0
            data.offset_y = 0
            
            setInitFunc(data)
        })
    }

    useEffect(() => {
        
        if (!isMakingGraph) return
        audioCtxRef.current = new AudioContext()
        mp3Ref.current.addEventListener("input", handleFileInput)
    }, [isMakingGraph])


    const handleEditSave = () => {
        
        
        
        const workingName = workingFunc.name

        const doesExist = (() => {
            const found = funcs.filter(f=>{
                return f.name == workingName
            })
            return found.length > 0 
        })()

        if (workingFunc.name == undefined) {
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
                    newFuncs.push(workingFunc)
                }
            })
            setFuncs(newFuncs)
            setWorkingFunc(initWorkingFunc)
        } else {
            setFuncs([...funcs, workingFunc])
            setWorkingFunc(initWorkingFunc)
        }
    }

    const handleEditExit = () => {
        setIsMakingGraph(false)
        setWorkingFunc(initWorkingFunc)
        props.isMakingGraph(false)
    }

    // select func to show, send to canvas
    const handleSelectFunc = (name) => {
        const toShow = funcs.filter(f => {
            return f.name == name
        })
        
        //
        //
        //
        props.changeFunc(toShow[0])
    }

   // need more robust check
   const noMusic = (func) => {
       return !func.bpm  
   }

   const initBasicFunc = (funcType) => {
       ampRef.current.value = ampRef.current.value==''?1:ampRef.current.value
       omegaRef.current.value = omegaRef.current.value==''?1:omegaRef.current.value
       offsetXRef.current.value = offsetXRef.current.value==''?0:offsetXRef.current.value
       offsetYRef.current.value = offsetYRef.current.value==''?0:offsetYRef.current.value
       setWorkingFunc({
        ...workingFunc, 
        amp: parseFloat(ampRef.current.value),
        omega: parseFloat(omegaRef.current.value),
        offset_x: parseFloat(offsetXRef.current.value),
        offset_y: parseFloat(offsetYRef.current.value),
        funcType: funcType
       })
   }

    const handleAmpChange = (e) => {
        const amp = e.target.value
        ampRef.current.value = amp 
        setWorkingFunc({...workingFunc, amp:amp})
    }

    const handleOmegaChange = (e) => {
        const omega = e.target.value
        omegaRef.current.value = omega
        setWorkingFunc({...workingFunc, omega:omega})
    }

    const handleFuncTypeChange = (e) => {
        const funcType = e.target.value
        funcTypeRef.current.value = funcType
        if (noMusic(workingFunc)) {
            initBasicFunc(funcType)
            return
        }
        setWorkingFunc({...workingFunc, funcType:funcType})
    }

    const handleOffsetXChange = (e) => {
        const offset = e.target.value
        offsetXRef.current.value = offset
        setWorkingFunc({...workingFunc, offset_x:offset})
    }

    const handleOffsetYChange = (e) => {
        const offset = e.target.value
        offsetYRef.current.value = offset
        setWorkingFunc({...workingFunc, offset_y:offset})
    }

    const handleNameChange = (e) => {
        const name = e.target.value
        nameRef.current.value = name
        setWorkingFunc({...workingFunc, name: name})
    }

    const handleMakeGraph = (e) => {
        setIsMakingGraph(true)
        props.isMakingGraph(true)
    }

    

    const handleRestoreDefault = () => {
        setWorkingFunc(initFunc)
        setRefs(initFunc)
    }

    const handleShowBeats = () => {
        if (!workingFunc.beats) return
        setWorkingFunc({...workingFunc, showBeats: !workingFunc.showBeats})
    }
    
    const handleEdit = (name) => {
        const toEdit = funcs.filter(f=> {
            return f.name == name
        })[0]
        setIsMakingGraph(true)
        
        setInitFunc(toEdit)
    }

    const handleMinMax = () => {
        setMinimize(!minimize)
    }

    // export stuff
    useEffect((()=> {
        if (!isExportMode){
            
            return
        } 
        
        fpsRef.current.value = exportFps
        durationRef.current.value = exportDuration
        exportRef.current.value = parser(exportFps, exportDuration, exportFunc)
        exportFuncRef.current.value = toString(exportFunc)
    }), [exportFps, exportDuration])

    const handleExport = (name) => {
        const func = funcs.filter(f=>{return f.name == name})[0]
        setExportFunc(func)
        setIsExportMode(true)
        setExportFps(24) 
        setExportDuration(100)
    }

    const handleExportExit = () => {
        setIsExportMode(false)
        setExportFps(null)
        setExportDuration(null)
    }

    const handleExportAreaClick = (e) => {
        e.target.select()
        document.execCommand('copy')
    }
 
    const handleFpsChange = (e) => {
        const fps = e.target.value
        fpsRef.current.value = fps 
        setExportFps(fps)
    }

    const handleDurationChange = (e) => {
        const s = e.target.value
        durationRef.current.value = s 
        setExportDuration(s)
    }

    const handleExportFuncAreaClick = (e) => {
        e.target.select()
        document.execCommand('copy')
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
                  <p style={{color: 'white', cursor: 'pointer'}}>Func</p>
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
                <div 
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
                        }   else if (!isMakingGraph && funcs && !isExportMode) {
                            return (
                                <>
                                    <div 
                                    className='tool-header header-font med' 
                                    onMouseDown={handleMove}
                                    style={{cursor: 'pointer'}}
                                     >
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
                                                    <ul >
                                                        <Graph 
                                                        key={i} 
                                                        func={f} 
                                                        selectFunc={handleSelectFunc}
                                                        availableTransforms={props.availableTransforms}
                                                        edit={handleEdit}
                                                        export={handleExport}
                                                        />
                                                    </ul>
                                                )
                                            })
                                        }
                                    </div>
                                </>
                            )
                        } else if (!isMakingGraph && isExportMode){
                            return (
                                <> 
                                <div 
                                className='tool-header header-font med'
                                onMouseDown={handleMove} 
                                style={{cursor: 'pointer'}}
                                >
                                    <p style={{paddingRight: 90, paddingLeft: 5}}>Export</p>
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
                                        <label className="label">fps:</label>
                                        <input ref={fpsRef} name="name" className="input" onChange={handleFpsChange} type="number"></input> 
                                    </div>
                                    <div className="input-container control-font">
                                        <label className="label">duration(s):</label>
                                        <input ref={durationRef} name="name" className="input" onChange={handleDurationChange} type="number"></input> 
                                    </div>
                                    <div className="label-container control-font">
                                        <label className="label info-text">frames:</label>
                                    </div>
                                    <div className="input-container">
                                        <textarea ref={exportRef} className="export-area" onClick={handleExportAreaClick}></textarea>
                                    </div>
                                    <div className="label-container control-font">
                                        <label className="label info-text">function:</label>
                                    </div>
                                    <div className="input-container control-font">
                                        <textarea ref={exportFuncRef} className="export-func-area" onClick={handleExportFuncAreaClick}></textarea> 
                                    </div>
                                    <div className="input-container">
                                        <button className="button high" onClick={handleExportExit}>exit</button>
                                    </div>
                                </div>
                       </> 
                            )
                        } else {
                            return (
                                <> 
                                    <div 
                                    className='tool-header header-font med' 
                                    onMouseDown={handleMove} 
                                    style={{cursor: 'pointer'}}
                                    >
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
                                            <input ref={nameRef} name="name" className="input" onChange={handleNameChange} type="text"></input> 
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
                                            step='0.1'
                                            ></input> 
                                        </div>
                                        <div className="input-container control-font">
                                            <label className="label">period</label>
                                            <input ref={omegaRef} name="omega" className="input" type="number" 
                                            onChange={handleOmegaChange}
                                            step='0.1'
                                            ></input> 
                                        </div>
                                        
                                        <div className="input-container control-font">
                                            <label className="label">offset_x</label>
                                            <input ref={offsetXRef} name="offset" className="input" type="number" 
                                            onChange={handleOffsetXChange}
                                            step='0.1'
                                            ></input> 
                                        </div>

                                        <div className="input-container control-font">
                                            <label className="label">offset_y</label>
                                            <input ref={offsetYRef} name="offset" className="input" type="number" 
                                            onChange={handleOffsetYChange}
                                            step='0.1'
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