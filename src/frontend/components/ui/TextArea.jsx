import * as React from "react";
import {cn} from "../../utils/utils.js";

function TextArea({className, ...props}) {
    return (
        <textarea
            data-solt={"textarea"}
            className={cn("placeholder:text-text-secondary flex field-sizing-content min-h-30 md:min-h-20 w-full rounded-md bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
    );
}

export { TextArea }