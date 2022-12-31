import React, { useState, useEffect, useRef } from 'react';
import curves from "../../funcs/curve"
import "../comps.css"

const nullFunc = {
    amp
    : 
    undefined,
    bpm
    : 
    undefined,
    fps
    : 
    undefined,
    offset
    : 
    undefined,
    omega
    : 
    undefined,
    phase
    : 
    undefined,
    showBeats
    : 
    false 
}

// scaling & zooming: https://github.com/OneLoneCoder/Javidx9/blob/master/ConsoleGameEngine/SmallerProjects/OneLoneCoder_PanAndZoom.cpp
const MakerCanvas = (props) => {
    const [linspace, setLinspace] = useState(0.003)
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


    // set Edit to true whe isMakingNewGraph 
    // new graph, load blank canvas
    useEffect((()=>{
        // whenever exit || enter graph maker, refresh canvas
        if (props.isMakingGraph) setPoints([])
        setEdit(props.isMakingGraph)
    }), [props.isMakingGraph])

    // receive new func to show
    useEffect((()=>{
        // init points
        if (props.funcToShow && !eqfunc(props.funcToShow, nullFunc)) {
            console.log('loaded', props.funcToShow)
            const t1 = 0
            const t2 = c2w(cDims.width,0).x 
            const newPoints = []
            for (let i=t1; i<t2+linspace; i+=linspace){
                newPoints.push(new Point(i, sin(i, props.funcToShow)))
            }
            console.log(newPoints.length)
            setPoints(newPoints)
        }
       setMaxX(c2w(cDims.width,0).x)
       setFuncToShow(props.funcToShow)
    }), [props.funcToShow])

    useEffect((()=>{
        draw()
    }), [funcToShow])
    
    // points added
    useEffect((() => {
        if (!ctx || !cDims.width) return 
        draw()
    }), [d.x, d.y])


    const sin = (t, f=funcToShow) => {
        switch (f.funcType) {
            case ('saw'): {
                return f.amp * (Math.cos((t-f.offset)*f.omega))**100 
            }
            case ('sin'): {
                return f.amp * Math.sin((t-f.offset)*f.omega)
            }
        }
        return f.amp * Math.sin((t-f.offset)*f.omega)
    }

    /*
    const sin = (t, f=funcToShow) => {
        return f.amp *Math.sin(t*f.omega + f.phase) + f.offset
    }
    */

    useEffect((() => {

        const container = containerRef.current;
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
        if (!funcToShow  || !funcToShow.showBeats) return
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
        
        const t1 = c2w(0,0).x
        const t2 = c2w(cDims.width,0).x
        const y1 = c2w(0,0).y
        const y2 = c2w(0, cDims.height).y

        const xpoints = []
        for (let i=Math.floor(t1); i<Math.ceil(t2); i++) {
            xpoints.push(new Point(i, 0))
        }
       
        const ypoints = []
        for (let i=Math.floor(y2); i<Math.ceil(y1); i++){
            ypoints.push(new Point(0, i))
        }

        return {xlabels: xpoints, ylabels: ypoints}
    }

    const addPoints = (newDx, newScale) => {
        if (eqfunc(funcToShow, nullFunc)) {
            return
        }
        const newWorldMaxX = cDims.width / (u2px*newScale) + newDx 
        const t1 = points[points.length-1]
        const newPoints = []
        for (let i=t1.x+linspace; i<newWorldMaxX+linspace; i+=linspace) {
            newPoints.push(new Point(i, sin(i)))
        }
        console.log('added p',newPoints.length)
        setPoints([...points, ...newPoints])
    }
    // TODO:
    // smarter memory slashing strategy needed
    const removePoints = (newDx, newScale) => {
        if (eqfunc(funcToShow, nullFunc)) {
            return
        }
        const newPoints = [...points]
        const newWorldMaxX = cDims.width / (u2px*newScale) + newDx
        const idx = Math.ceil(newWorldMaxX/linspace)
        const toPop = points.length - idx
        for (let i=0; i<toPop;i++) {
            newPoints.pop()
        }
        setPoints(newPoints)
    }

    //////////////////////////////////////////////////////////// 
    // all draws
    //////////////////////////////////////////////////////////// 

    const bcurve = (tension) => {
        if (points.length == 0) return
        console.log(points.length)

        const t1 = c2w(0,0).x
        const t2 = c2w(cDims.width,0).x
        const i1 = Math.floor(t1/linspace) <= 0 ? 0 : Math.floor(t1/linspace)-1
        const i2 = Math.ceil(t2/linspace)+1 > points.length-1 ? points.length-1 : Math.ceil(t2/linspace)+1
        console.log('comp',i2-i1)

        const points0 = w2c(points[i1].x, points[i1].y)
        ctx.beginPath();
        ctx.moveTo(points0.cx, points0.cy);
        //console.log(points0.cx, points0.cy)
        var t = (tension != null) ? tension : 1;
        for (var i = i1; i < i2; i++) {
            var p0 = (i > i1) ? w2c(points[i-1].x, points[i-1].y) : w2c(points[i].x, points[i].y);
            var p1 = w2c(points[i].x, points[i].y);
            var p2 = w2c(points[i+1].x, points[i+1].y);
            var p3 = (i <= i2 - 2) ? w2c(points[i+2].x, points[i+2].y) : p2;
    
            var cp1x = p1.cx + (p2.cx - p0.cx) / 6 * t;
            var cp1y = p1.cy + (p2.cy - p0.cy) / 6 * t;
    
            var cp2x = p2.cx - (p3.cx - p1.cx) / 6 * t;
            var cp2y = p2.cy - (p3.cy - p1.cy) / 6 * t;
    
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.cx, p2.cy);
        }
        ctx.stroke()
    }


    const drawLabels = (labels2render) => {
        
        const xlabels = labels2render.xlabels
        const ylabels = labels2render.ylabels
        ctx.save()
        ctx.fillStyle = 'black'
        const f = scale > 3.0 ? 10 : Math.floor(scale/3.0*10)
        const b = scale > 3.0 ? 3 : Math.floor(scale/3.0*3)
        ctx.font = `${f}px serif`
        xlabels.map(p => {
            const conv = w2c(p.x, p.y)
            ctx.fillStyle = 'black'
            ctx.fillText(`${p.x}`,conv.cx+b, conv.cy-b)
            ctx.beginPath()
            ctx.moveTo(conv.cx, conv.cy-b)
            ctx.lineTo(conv.cx, conv.cy+b)
            ctx.stroke()
            ctx.closePath()
        })
        ylabels.map(p => {
            const conv = w2c(p.x, p.y)
            ctx.fillStyle = 'black'
            if (p.y != 0) {
                ctx.fillText(`${p.y}`, conv.cx+b+2, conv.cy+b)
                ctx.beginPath()
                ctx.moveTo(conv.cx-b, conv.cy)
                ctx.lineTo(conv.cx+b, conv.cy)
                ctx.stroke()
                ctx.closePath()
            } 
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

    const draw = () => {
        if (!ctx) return
        ctx.clearRect(0, 0, cDims.width, cDims.height);
        const render = pointsInFrame()
        //addPoints()
        //drawPoints(ps2render)
        bcurve(1)
        drawBeats()
        //drawUnits()
        drawAxis() 
        drawLabels(render)
    }

    const handleOnMouseDown = (e) => {
       setDragging(true)
       setMousePos({x: e.clientX, y: e.clientY})
    }

    const handleMouseMove = (e) => {
        if (!dragging) return
        const dx = e.clientX - mousePos.x
        const dy = e.clientY - mousePos.y

        var setdx = dx/scale/u2px;
        var setdy = dy/scale/u2px;
        /*
        if ((axis.x-d.x+setdx)*u2px*scale > 5) {
            //setdx = 0
        }*/
        const newdx = d.x-setdx
        if (newdx > d.x) {
            const newMaxX = cDims.width / (u2px*scale) + newdx
            if (newMaxX > maxX) {
                addPoints(newdx, scale)
                setMaxX(newMaxX)
            }
        }
        //else removePoints(newdx, scale)
        // add points before change
        // remove points

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
        /*
        if ((axis.x-dx-dx)*u2px*s > 5) {
            //dx=0
        }
        */
        // add points before change
        const newdx = d.x + dx
        console.log('wheel')
        if (newdx < d.x) {
            const newMaxX = cDims.width / (u2px*s) + newdx
            if (newMaxX >= maxX) {
                addPoints(newdx, s)
                setMaxX(newMaxX)
            }
        }
        //else removePoints(newdx, s)
        // remove points after change

        setD({x: d.x + dx, y: d.y + dy})
    }

    // utils

    const eqfunc = (a,b) => {
        if (a.amp == b.amp && a.bpm == b.bpm && a.fps == b.fps && a.offset == b.offset && a.omega == b.omega && a.phase == b.phase && a.showBeats == b.showBeats) return true
        else return false
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