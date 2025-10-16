import { Route, Routes as ReactRoutes, Outlet } from "react-router-dom";
import {AuthLayout} from "../layout/auth-layout.jsx";
import {AppLayout} from "../layout/app-layout.jsx";
import HomePage from "../frontend/pages/app-layout/home/HomePage.jsx";
import AuthForm from "../frontend/pages/auth-layout/AuthForm.jsx";

export const Routes = () => {
    return (
        <ReactRoutes>
            <Route element={
                <AuthLayout>
                    <Outlet />
                </AuthLayout>
            }>
                <Route path={"/login"} element={<AuthForm type={"signin"}/>} />
                <Route path={"/signup"} element={<AuthForm type={"signup"}/>} />
                <Route path={"/resetpassword"} element={<AuthForm type={"forgotpassword"}/>} />
            </Route>
            <Route
                element={
                <AppLayout>
                    <Outlet />
                </AppLayout>
            }>
                <Route path={"/"} element={<HomePage />}/>
                {/*<Route path={"*"} element={<NotFound />}/>*/}
            </Route>
        </ReactRoutes>
    );
}