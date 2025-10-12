import { Route, Routes as ReactRoutes, Outlet } from "react-router";
import AuthForm from "../pages/auth-layout/AuthForm.jsx";
import HomePage from "../pages/HomePage.jsx";

export const Routes = () => {
    return (
        <ReactRoutes>
            <Route element={<AuthForm><Outlet /></AuthForm>}>
                <Route path={"/login"} element={<AuthForm type={"signin"}/>} />
                <Route path={"/signup"} element={<AuthForm type={"signup"}/>} />
                <Route path={"/resetpassword"} element={<AuthForm type={"forgotpassword"}/>} />
            </Route>
            <Route
                element={
                    <HomePage>
                            <Outlet />
                    </HomePage>
                }>
                <Route path={"/"} element={<HomePage />}/>
                {/*<Route path={"*"} element={<NotFound />}/>*/}
            </Route>
        </ReactRoutes>
    );
}