import React from "react";

export const AppLayout = ({ children }) => {
    return (
        <div className={"h-svh w-full"}>
            <main className={"w-full min-h-full"}>{children}</main>
        </div>
    );
};