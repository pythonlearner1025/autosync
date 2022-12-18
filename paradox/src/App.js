import logo from './logo.svg';
import { NextUIProvider } from '@nextui-org/react';
import './App.css';
import TransformBlock from "./comps/TransformBlock"

function App() {
  return (
    <NextUIProvider>
      <TransformBlock/>
    </NextUIProvider>
  );
}

export default App;
