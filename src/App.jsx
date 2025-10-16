import {StrictMode, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import { Routes } from "./routes/routes.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <StrictMode>
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
        </StrictMode>
    </>
  )
}

export default App
