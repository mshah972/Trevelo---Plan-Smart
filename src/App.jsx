import {StrictMode, useState} from "react";
import AuthForm from "./frontend/pages/auth-layout/AuthForm.jsx";
import HomePage from "./frontend/pages/HomePage.jsx";
import {BrowserRouter, Route} from "react-router-dom";
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
