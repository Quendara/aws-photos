import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "./Icons"

export const CancelFilter = ({ value, callback }) => {

    

    return (
        <>
        { value.length > 0 && <span className="blue badge" onClick={() => callback("")}  ><b>{value} </b><Icon icon="cancel" ></Icon></span>     }
        </>
    )
}

