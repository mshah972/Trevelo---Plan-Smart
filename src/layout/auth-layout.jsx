import React from "react";

export const AuthLayout = ({ children }) => {
    return (
        <div className={"min-h-svh bg-background"}>
            {children}
        </div>
    );
}