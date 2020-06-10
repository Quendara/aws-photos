import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faAngleDoubleRight,
    faSignOutAlt,
    faClock,
    faStar,
    faUserAstronaut,
    faMapMarkerAlt,
    faWindowClose
  } from "@fortawesome/free-solid-svg-icons";

import React from "react";

const textToIcon = {
    "location": faMapMarkerAlt,
    "rating": faStar,
    "year": faClock,
    "cancel": faWindowClose,

}

const getIcon = ( name ) => {
    let ret = textToIcon[ name ]
    if( ret === undefined ){
        ret = faUserAstronaut
    }

    console.log( "getIcon" , name, "->" ,  ret )

    return ret
}



export const Icon = ( { icon } ) => {
      return(

        <FontAwesomeIcon icon={ getIcon( icon ) } className="mr-2" />

      )
  }
