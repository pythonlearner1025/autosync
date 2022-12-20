import React, { useState, useEffect, useRef } from 'react';
import axios from "axios"
import "../comps.css"


const MakerControlFunc = (props) => {
    const [file, setFile] = useState(null)
    const [y, setY] = useState(null)
    const [t, setT] = useState(null)
    const fpsRef = useRef(null)
    const bpmRef = useRef(null)
    const ampRef = useRef(null)
    const mp3Ref = useRef(null)
    const audioCtxRef = useRef(null)

    useEffect((()=> {
        if (!y || !t) return
        console.log(t)
        console.log(y)
        props.addData({t:t, y:y})
    }), [t,y])

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
        console.log(duration*hz, ch1.length)
        // send 5 seconds
        for (let i=hz*30; i<hz*40; i++){
            data.push(ch1[i])
        }
        console.log(data.length)
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
        audioCtxRef.current = new AudioContext()
        mp3Ref.current.addEventListener("input", handleFileInput)
    }, [])

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

    return (
        <div className="MakerControlFunc-Container yellow">
            <div style={{justifyText: "center"}}><em>f(x)</em></div>
            <div>
                <label for="mp3">mp3</label>
                <input ref={mp3Ref} name="mp3" className="input" type="file"></input> 
            </div>
            <div>
                <label for="fps">fps</label>
                <input ref={fpsRef} name="fps" className="input" type="number" 
                onChange={handleFpsChange}></input> 
            </div>
            <div>
                <label for="bpm">BPM</label>
                <input ref={bpmRef} name="bpm" className="input" type="number"
                onChange={handleBpmChange}></input> 
            </div>
            <div>
                <label for="amp">amp</label>
                <input ref={ampRef} name="amp" className="input" type="number"
                onChange={handleAmpChange}></input> 
            </div>
        </div>
    )
}

export default MakerControlFunc