import React from "react";
import { Icon } from "./Icons"

export const CancelFilter = ({ value, filter, callback }) => {

    return (
        <>
        { value.length > 0 && <button className="btn blue ml-2" onClick={() => callback( filter,"")}  >
        <Icon icon={filter} className="mr-2" /><b>{value} </b><Icon icon="cancel" className="ml-2" />
            </button>     }
        </>
    )
}

