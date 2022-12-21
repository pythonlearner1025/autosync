import React, { useRef, useState, useEffect } from 'react';
import constant from "../config/constant"
import './comps.css'
import Container from "./Container.js"
// constant == block outline that does not change
// draw X == only draw X curve
// drawALL == draw all curve


/*
    DID:
    (skeleton) 
    - draw UI
    - draw curves according to active transform
    - 

    TODO: 
    (UI)
    - default settings for UI
    - design so when expanding transformCanvas, things adjust 
    (callbacks)
    - clicking "add transform"
    - switching active transform 

    TODO: 
        - limit span to the transformContainerDim
        - set Canvas span when transformerContainerDim changes

*/

/*
    states:
    - graphs
    - points
    
    props:
    - transformToShow
    - 
*/

const TransformCanvas = (props) => {
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

    // draw stuff
    const [ctx, setCtx] = useState(null)
    const [dims, setDims] = useState({})
    const [f, setF] = useState(0.05)
    const [scale, setScale] = useState(1.0)
    const [u2px, setU2px] = useState(10)

    // graph stuff
    // graph representations
    // {name:x, transform:x, points:x}
    const [graphReps, setGraphReps] = useState([])
    const [dragging, setDragging] = useState(false)
    const [d, setD] = useState({x:0, y:0})
    const [mousePos, setMousePos] = useState({})
    const [axis, setAxis] = useState(null)
    const canvasRef = useRef(null)
    const containerRef = useRef(null)

    // draw controls
    const [activeTransform, setActiveTransform] = useState(null)

    useEffect((() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const ctx = canvas.getContext('2d')
        canvas.width = container.offsetWidth
        canvas.height = container.offsetHeight

        setCtx(ctx)
        setDims({width: canvas.width, height: canvas.height})
        setAxis(new Axis())

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }), [])

    useEffect((()=> {
        setActiveTransform(props.activeTransform)
    }),[props.activeTransform])

    useEffect((() => {
        if (graphReps.length == props.graphs) return
        const newGraphReps = []
        console.log(props.graphs)
        props.graphs.map(graph => {
            var newGraphRep = {}
            newGraphRep.name = graph.name
            newGraphRep.transform = graph.transform
            const points = c2points(graph.t, graph.y)
            newGraphRep.points = points
            newGraphReps.push(newGraphRep)
        })
        setGraphReps([...graphReps, ...newGraphReps])
    }), [props.graphs])

    useEffect((()=> {
        if(!ctx || !dims.width) return
        draw()
    }), [graphReps, activeTransform, d])

    const c2points = (t,y) => {
        const points = []
        for (let i=0; i<t.length;i++){
            points.push(new Point(t[i], y[i]))
        }
        return points
    }

    const draw = () => {
        // decide which graph to draw
        ctx.clearRect(0, 0, dims.width, dims.height);
        console.log(activeTransform)
        drawAxis()
        graphReps.map(g=> {
            if (activeTransform == g.transform) {
                drawPoints(g.points)
                drawCurve(g.points)
            }
        }) 
    }

    const drawPoints = (points) => {
        ctx.save()
        points.map(p => {
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
        ctx.lineTo(dims.width, conv.cy)
        ctx.stroke()

        ctx.moveTo(conv.cx, 0)
        ctx.lineTo(conv.cx, dims.height)
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }
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
        ctx.stroke();
    }

    const drawCurve = (points) => {
        //const ps = convertForCurves()
        //if (ps.length <= 0) return
        //console.log(ps.length)
        //curves(ctx, ps)
        if (points.length <= 0) return
        bcurve(points, 1)
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
        if ((axis.x-d.x+setdx)*u2px*scale > 0) {
            setdx = 0
        }
        setD({x: d.x - setdx, y:d.y + setdy})
        setMousePos({x: e.clientX, y: e.clientY})
    }

    const handleMouseUp = (e) => {
        setDragging(false)
    }

    const w2c = (x,y,s=scale) => {
        const h = canvasRef.current.height
        const cx = (x-d.x)*u2px*s
        const cy = h/2-((y-d.y)*u2px*s)
        return {cx: cx, cy: cy}
    }

    const c2w = (cx,cy, s=scale) => {
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
        if ((axis.x-dx-dx)*u2px*s > 0) {
            dx=0
        }
        setD({x: d.x + dx, y: d.y + dy})
    }

    return (
        // UI wrapper around canvas
        <div ref={containerRef} className="TransformCanvas-Container">
            <canvas 
            ref={canvasRef}
            onMouseDown={handleOnMouseDown} 
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
             />
        </div>
    );
    };

    export default TransformCanvas;
