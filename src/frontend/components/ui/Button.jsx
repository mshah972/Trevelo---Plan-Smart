import * as React from "react";
import {cn} from "/src/frontend/utils/utils.js"

const variantClasses = {
    default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90",
    destructive: "bg-red-500 text-white shadow-xs hover:bg-red-500/90 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-500/60 dark:bg-red-900 dark:hover:bg-red-900/90 dark:focus-visible:ring-red-900/20 dark:dark:focus-visible:ring-red-900/40 dark:dark:bg-red-900/60",
    outline: "border bg-white shadow-xs hover:bg-neutral-100 hover:text-neutral-900 dark:bg-neutral-200/30 dark:border-neutral-200 dark:hover:bg-neutral-200/50 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:dark:bg-neutral-800/30 dark:dark:border-neutral-800 dark:dark:hover:bg-neutral-800/50",
    secondary: "bg-secondary text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
    ghost: "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-100/50 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:dark:hover:bg-neutral-800/50",
    link: "text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50"
};

const sizeClasses = {
    default: "h-10 px-4 py-2 has-[>svg]:px-3",
    sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
    lg: "h-11 rounded-md px-6 has-[>svg]:px-4",
    icon: "size-9"
};

function Button({ className, variant = "default", size = "default", ...props }) {
    const allClasses = cn(
        "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 rounded-full",
        variantClasses[variant],
        sizeClasses[size],
        className
    );
    return (
        <button
            data-slot="button"
            className={allClasses}
            {...props}
        />
    );
}

export { Button };
