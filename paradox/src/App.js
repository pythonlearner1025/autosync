import { NextUIProvider } from '@nextui-org/react';
import { Button } from "@nextui-org/react";
import './App.css';
import './comps/comps.css'
import Maker from "./comps/maker/Maker"
import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [fixed, setFixed] = useState(false)

  const handleClick = () => {
    setFixed(!fixed)
  }
  // global listeners 

  return (
    <NextUIProvider>
      <Maker/>
    </NextUIProvider>
  );
}

export default App;
