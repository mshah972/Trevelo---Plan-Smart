import * as React from "react";
import {cn} from "../../utils/utils.js";

function TextArea({className, ...props}) {
    return (
        <textarea
            data-solt={"textarea"}
            className={cn("placeholder:text-text-secondary flex field-sizing-content min-h-16 w-full rounded-md bg-transparent px-3 py-2 text-base outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)} {...props} />
    );
}

export { TextArea }