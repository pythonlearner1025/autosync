import { NextUIProvider } from '@nextui-org/react';
import { Button } from "@nextui-org/react";
import './App.css';
import './comps/comps.css'
import TransformBlock from "./comps/TransformBlock"
import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [fixed, setFixed] = useState(false)

  const handleClick = () => {
    setFixed(!fixed)
  }
  // global listeners 

  return (
    <NextUIProvider>
      <Button onPress={handleClick}>Fix</Button>
      <TransformBlock 
        fixed={fixed}
        />
    </NextUIProvider>
  );
}

export default App;
