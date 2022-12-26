import React, { useState, useEffect, useRef } from 'react';
import curves from "../../funcs/curve"
import "../comps.css"


// scaling & zooming: https://github.com/OneLoneCoder/Javidx9/blob/master/ConsoleGameEngine/SmallerProjects/OneLoneCoder_PanAndZoom.cpp
const MakerCanvas = (props) => {
    const [linspace, setLinspace] = useState(0.02)
    const [funcToShow, setFuncToShow] = useState(null)
    const [range, setRange] = useState(props.range)
    const [cDims, setCDims] = useState({})
    const [f, setF] = useState(0.05)
    const [scale, setScale] = useState(1.0)
    const [points, setPoints] = useState([])
    const [u2px, setU2px] = useState(10)
    const [ctx, setCtx] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [d, setD] = useState({x: 0, y:0})
    const [mousePos, setMousePos] = useState({})
    const [edit, setEdit] = useState(false)
    const [axis, setAxis] = useState(null)
    const [maxX, setMaxX] = useState(0)
    const canvasRef = useRef(null)
    const containerRef = useRef(null)

    // return added points to grpah when don
    useEffect((()=> {
        if (!props.workingGraph) return 
        const t = []
        const y = []
        points.map(p => {
            t.push(p.x)
            y.push(p.y)
        })
        props.returnGraph({t:t, y:y})
    }), [props.workingGraph])

    // set Edit to true whe isMakingNewGraph 
    // new graph, load blank canvas
    useEffect((()=>{
        // whenever exit || enter graph maker, refresh canvas
        if (props.isMakingGraph) setPoints([])
        setEdit(props.isMakingGraph)
    }), [props.isMakingGraph])

    useEffect((()=>{
        setFuncToShow(props.funcToShow)
    }), [props.funcToShow])

    useEffect((()=>{
        //console.log(funcToShow.beats)
        draw()
    }), [funcToShow])

    const sin = (t) => {
        return funcToShow.amp *Math.sin(t*funcToShow.omega + funcToShow.phase) + funcToShow.offset
    }

    useEffect((() => {

        const container = containerRef.current;
        const PIXEL_RATIO = (() => {
            const ctx = canvasRef.current.getContext('2d')
            const dpi = window.devicePixelRatio || 1
            const bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
            return dpi/bsr
        })()

        const canvas = canvasRef.current
        canvas.width = container.offsetWidth 
        canvas.height = container.offsetHeight 
        canvas.style.width = `${container.offsetWidth }px`
        canvas.style.height = `${container.offsetHeight }px`
        canvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
        const ctx = canvas.getContext('2d')

        setCtx(ctx)
        setCDims({width: canvas.width, height: canvas.height})
        setMaxX(c2w(canvas.width,0).x)
        setAxis(new Axis())
        console.log(canvas)

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }), [])
    
    // points added
    useEffect((() => {
        if (!ctx || !cDims.width) return 
        draw()
    }), [d])

    class Point {
        constructor(x,y) {
            this.x = x
            this.y = y
        }
        draw() {
            
        }
    }

    class Axis {
        constructor() {
            this.x = 0
            this.y = 0
        }
    }
    
    const drawBeats = () => {
        if (!funcToShow.showBeats) return
        funcToShow.beats.map(beat => {
            const p1 = w2c(beat, 10) 
            const p2 = w2c(beat, -10)
            ctx.beginPath()
            ctx.moveTo(p1.cx, p1.cy)
            ctx.lineTo(p2.cx, p2.cy)
            ctx.stroke()
            ctx.closePath()
        })
    }


    const pointsInFrame = () => {
        if (!funcToShow) return []
        const t1 = c2w(0,0).x
        const t2 = c2w(cDims.width,0).x
        const ps2render = []
        for (let i=t1; i<t2+1; i+=linspace) {
            if (i >= 0) {
                const t = i 
                ps2render.push(new Point(t, sin(t)))
            }
        }
        return ps2render
    }

    //////////////////////////////////////////////////////////// 
    // all draws
    //////////////////////////////////////////////////////////// 

    const bcurve = (points, tension) => {
        const points0 = w2c(points[0].x, points[0].y)
        ctx.moveTo(points0.cx, points0.cy);
        ctx.beginPath();

        var t = (tension != null) ? tension : 1;
        for (var i = 0; i < points.length - 1; i++) {
            var p0 = (i > 0) ? w2c(points[i - 1].x, points[i-1].y) : w2c(points[0].x, points[0].y);
            var p1 = w2c(points[i].x, points[i].y);
            var p2 = w2c(points[i + 1].x, points[i+1].y);
            var p3 = (i != points.length - 2) ? w2c(points[i+2].x, points[i+2].y) : p2;
    
            var cp1x = p1.cx + (p2.cx - p0.cx) / 6 * t;
            var cp1y = p1.cy + (p2.cy - p0.cy) / 6 * t;
    
            var cp2x = p2.cx - (p3.cx - p1.cx) / 6 * t;
            var cp2y = p2.cy - (p3.cy - p1.cy) / 6 * t;
    
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.cx, p2.cy);
        }
        ctx.stroke()
    }

    const drawCurve = (ps2render) => {
        if (ps2render.length <= 0) return
        bcurve(ps2render, 1)
    }

    const drawPoints = (ps2render) => {
        ctx.save()
        ps2render.map(p => {
            ctx.beginPath()
            const conv = w2c(p.x, p.y)
            ctx.arc(conv.cx, conv.cy, 1, 0, 2 * Math.PI, false)
            ctx.fillStyle = 'red'
            ctx.fill()
            ctx.closePath()
        })
        ctx.restore()
    }

    const drawAxis = () => {
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = 'black'
        const conv = w2c(axis.x, axis.y)
        ctx.moveTo(0, conv.cy)
        ctx.lineTo(cDims.width, conv.cy)
        ctx.stroke()

        ctx.moveTo(conv.cx, 0)
        ctx.lineTo(conv.cx, cDims.height)
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }

    const drawUnits = () => {
        // left
        var length = 5
        // dpi
        var mid = cDims.height / 2 
        ctx.fillStyle = 'black'
        ctx.font = '10px serif'
        for (let i=0; i<mid; i+=mid/(mid/u2px)) {
            if (i==0) {
                ctx.moveTo(0,mid)
                ctx.lineTo(length, mid)
                ctx.stroke()
                const conv = c2w(length, mid)
                //ctx.fillText(`${conv.x/u2px},${conv.y/u2px}`,length, mid)
                continue
            }
            ctx.moveTo(0,mid-i)
            ctx.lineTo(length,mid-i)
            ctx.stroke()
            
            if (i+(mid / (mid/u2px)) < mid) {
                ctx.moveTo(0,mid+i)
                ctx.lineTo(length,mid+i)
                ctx.stroke()
            } 
        }

        // bottom
        for (let i=0; i<cDims.width; i+=cDims.width / (cDims.width/u2px)) {
            if (i==0) continue
            ctx.moveTo(i,cDims.height)
            ctx.lineTo(i,cDims.height-length)
            ctx.stroke()
        }
    }

    const draw = () => {
        if (!ctx) return
        ctx.clearRect(0, 0, cDims.width, cDims.height);
        const ps2render = pointsInFrame()
        //addPoints()
        //drawPoints(ps2render)
        drawBeats()
        drawCurve(ps2render)
        drawUnits()
        drawAxis() 
    }

    const handleOnMouseDown = (e) => {
        console.log('here',edit)
        if (edit) {
            const rect = canvasRef.current.getBoundingClientRect()
            const cx = e.clientX - rect.left
            const cy = e.clientY - rect.top
            const conv = c2w(cx,cy)
            const p = new Point(conv.x, conv.y)
            setPoints([...points, p])
        } 
       setDragging(true)
       setMousePos({x: e.clientX, y: e.clientY})
    }

    const handleMouseMove = (e) => {
        if (!dragging) return
        const dx = e.clientX - mousePos.x
        const dy = e.clientY - mousePos.y

        var setdx = dx/scale/u2px;
        var setdy = dy/scale/u2px;
        if ((axis.x-d.x+setdx)*u2px*scale > 5) {
            setdx = 0
        }
        setD({x: d.x - setdx, y:d.y + setdy})
        setMousePos({x: e.clientX, y: e.clientY})
    }

    const handleMouseUp = (e) => {
        setDragging(false)
    }


    const handleKeyDown = (e) => {
        if (e.key == 'e') setEdit(edit ? false : true)
    }

    const w2c = (x,y,s=scale) => {
        const h = canvasRef.current.height
        const cx = (x-d.x)*u2px*s
        const cy = h/2-((y-d.y)*u2px*s)
        return {cx: cx, cy: cy}
    }

    const c2w = (cx,cy,s=scale) => {
        const h = canvasRef.current.height
        const x = cx / (u2px*s) + d.x
        const y = -(cy - h/2 )/(u2px*s)+d.y
        return {x: x, y: y}
    }

    const handleWheel = (e) => {
        const rect = canvasRef.current.getBoundingClientRect()
        const cx = e.clientX - rect.left
        const cy = e.clientY - rect.top
        const before = c2w(cx,cy,scale)
        // before zoom
        var after;  
        var s = scale;
        if (e.deltaY >= 0) {
            setScale(scale * (1+f))
            after = c2w(cx,cy,scale*(1+f))
            s = s * (1+f)
        } else{
            setScale(scale * (1-f))
            after = c2w(cx,cy,scale*(1-f))
            s = s * (1-f)
        }
        var dx = before.x-after.x
        var dy = before.y-after.y
        if ((axis.x-dx-dx)*u2px*s > 5) {
            dx=0
        }
        setD({x: d.x + dx, y: d.y + dy})
    }

    document.addEventListener('keydown', handleKeyDown)

    return (
        <div ref={containerRef} className="MakerCanvas-Container blue">
            <canvas 
            ref={canvasRef}
            onMouseDown={handleOnMouseDown} 
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            />
        </div>
    )
}

export default MakerCanvas