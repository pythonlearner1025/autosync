import React, { useRef, useState, useEffect } from "react";
import "./comps.css"

const Container = (props) => {
    // Create a ref for the div element
    /*
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [style, setStyle] = useState({
         width: props.dim.width,
         height: props.dim.height,
         cursor: 'default'
        });
    const [isResizing, setIsResizing] = useState(false);
    const [thresh, setThresh] = useState(5);
    const divRef = useRef(null);

    // to be called when TOP changes width, height, or scale, and style changes
    useEffect(() => {
        const div = divRef.current;
        div.style.width = `${style.width}px`;
        div.style.height = `${style.height}px`;
        div.style.cursor = style.cursor;
        // for entire document
    }, [style])

    // Event handlers for mouse move, mouse leave, mouse down, and mouse up
    const handleMouseMove = (event) => {
        let newCursor = 'default'
        if (Math.abs(cursorPos.x) < thresh || cursorPos.x > style.width - thresh || cursorPos.x > style.width + thresh ) 
            newCursor = 'ew-resize'
        else if (Math.abs(cursorPos.y) < thresh || cursorPos.y > style.height - thresh || cursorPos.y > style.height + thresh) 
            newCursor = 'ns-resize'
        setStyle({
            width: style.width,
            height: style.height,
            cursor: newCursor
        })
         // Calculate the cursor's position within the div
        const rect = divRef.current.getBoundingClientRect();
        setCursorPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
        if (!isResizing || style.cursor == 'default') return
        const dx = event.clientX - rect.left - cursorPos.x;
        const dy = event.clientY - rect.top - cursorPos.y;
        switch (style.cursor) {
            case ('ew-resize'): {
                setStyle({
                    width: style.width + dx,
                    height: style.height,
                    cursor: style.cursor
                });
                break;
            }
            case ('ns-resize'): {
                setStyle({
                    width: style.width,
                    height: style.height + dy,
                    cursor: style.cursor
                })
                break;
            }
        }
    };
  
    const handleMouseDown = () => {
        setIsResizing(true);
    };
    const handleMouseUp = () => {
        setIsResizing(false);
    };

    

    /*
         onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
    */

    return (
        <div
            className={props.className}
        >
            {props.children}
        </div>
    );
};

export default Container;
