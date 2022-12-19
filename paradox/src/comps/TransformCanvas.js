import React, { useRef, useState, useEffect } from 'react';
import constant from "../config/constant"
import './comps.css'
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

const TransformCanvas = (props) => {
    const [canvasDim, setCanvasDim] = useState(constant.TransformCanvas.containerDim)
    const canvasRef = useRef(null);
    const ctx = useRef(null);

    // draw UI for Tblock
    useEffect(() => {
        const canvas = canvasRef.current;
        ctx.current = canvas.getContext('2d');
        canvas.width = canvasDim.width 
        canvas.height = canvasDim.height

        // Clear the canvas
        ctx.current.clearRect(0, 0, canvas.width, canvas.height);
        drawUI()
    }, [props.transformDim, props.scale])

    // which transform to show
    useEffect(() => {

        switch (props.active.id) {
            case 'all': {
                drawAll(props.transforms)
            }
            case 't_angle': {
                drawCurve(props.transforms.t_angle)
            }
        }

    }, [props.active, props.transforms])


    useEffect(() => {
        // Add a mouse dblclick event listener to the canvas
        canvasRef.current.addEventListener('dblclick', handleDoubleClick);

            // Remove the event listener when the component is unmounted
        return () => {
            canvasRef.current.removeEventListener('dblclick', handleDoubleClick);
            };
    }, []);

    const handleDoubleClick = (event) => {
        console.log('Mouse double click detected!');

        // if the mouse clicked on a point, set the point as "tweaking in parent"
        // point class in parent should have color value to show its being tweaked
        const X = event.clientX
        const Y = event.clientY
        var res = onPoint(X,Y)
        if (res.point) {
            // apply all mousemove changes to tweaked point
            props.setTweak(res)
            // Add a mouse move event listener
            canvasRef.current.addEventListener('mousemove', handleMouseMove);

            // Remove the event listener when the mouse button is released
            canvasRef.current.addEventListener('mouseup', () => {
                canvasRef.current.removeEventListener('mousemove', handleMouseMove);
            });
        }
   };

    const handleMouseMove = (event) => {
        // Calculate the mouse offset relative to the element
        const rect = event.target.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        // Call the parent component's callback function
        props.onTweak({ offsetX, offsetY });
    };

    const drawUI = () => {
        // draw the UI on span change
        
    }

    const drawAll = (transforms) => {
        // don't think requestAnimationFrame is necessary,
        // useEffect will call draw whenever stuff changes
        for (var transform in transforms) {
            if (transform.points) {
                drawCurve(transform)
            }
        }
    };

    // draw a single curve, according to transform specifications
    const drawCurve = (transform) => {

    }

    ////////////////////////////////////////////////////////////
    // helper funcs
    ////////////////////////////////////////////////////////////
    const onPoint = (x,y) => {
        var point = null;
        var tid = null;
        switch (props.active.id) {
            case 'all': {
                for (var transform in props.transforms) {
                    point = searchPoint(transform, x, y) 
                    tid = transform.id
                }
            }
            case 't_angle': {
                point = searchPoint(props.transforms.t_angle, x, y)
                tid = props.transform.t_angle.id
            }
        } 
        return {point, tid}
    }

    const searchPoint = (transform, x, y) => {

    }

    // world points to canvas points
    const w2c = (x,y) => {
        return {x,y}
    }

    return (
        // UI wrapper around canvas
        <>
            <canvas ref={canvasRef} width={props.width} height={props.height} />
        </>
    );
    };

    export default TransformCanvas;
