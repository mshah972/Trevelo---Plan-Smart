import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./frontend/pages/AuthForm.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Router>
            <div>
                <section>
                    <Routes>
                        <Route path={"/"} element={<AuthForm type={"signup"}/>}/>
                        <Route path={"/login"} element={<AuthForm type={"signin"}/>}/>
                        <Route path={"/resetPassword"} element={<AuthForm type={"forgotpassword"}/>}/>
                    </Routes>
                </section>
            </div>
        </Router>
    </>
  )
}

export default App
