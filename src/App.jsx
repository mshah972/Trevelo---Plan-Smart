import {StrictMode, useState} from "react";
import AuthForm from "./frontend/pages/auth-layout/AuthForm.jsx";
import HomePage from "./frontend/pages/HomePage.jsx";
import {BrowserRouter} from "react-router";
import {Routes} from "./frontend/routes/routes.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        {/*<Router>*/}
        {/*    <div>*/}
        {/*        <section>*/}
        {/*            <Routes>*/}
        {/*                <Route path={"/"} element={<HomePage />}/>*/}
        {/*                <Route path={"/login"} element={<AuthForm type={"signin"}/>}/>*/}
        {/*                <Route path={"/resetPassword"} element={<AuthForm type={"forgotpassword"}/>}/>*/}
        {/*            </Routes>*/}
        {/*        </section>*/}
        {/*    </div>*/}
        {/*</Router>*/}
        <StrictMode>
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
        </StrictMode>
    </>
  )
}

export default App
