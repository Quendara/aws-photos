import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faPlus,
  // faAngleDoubleRight,
  // faSignOutAlt,
  faClock,
  faStar,
  faFolder,
  faUserAstronaut,
  faMapMarkerAlt,
  faWindowClose,
  faStarAndCrescent,
  faCity,

  faList,
  faThList,
  faThLarge,
  faChevronLeft,
  faChevronRight,
  faArrowCircleLeft,
  faArrowCircleRight,
  faTimes,
  faArrowUp,
  faClipboard,
  faGlobe,
  faGlobeEurope
  // fasStar,
} from "@fortawesome/free-solid-svg-icons";

import React from "react";

const textToIcon = {
  // GPS
  "location": faMapMarkerAlt,
  "country": faGlobe,
  "state": faGlobeEurope,
  "city": faCity,
  "map": faMapMarkerAlt,
  "clipboard": faClipboard,
  "arrow-right": faChevronRight,
  "arrow-left": faChevronLeft,
  "rating": faStar,
  "dirname": faFolder,
  "folder": faFolder,
  "filename": faFolder,

  "list": faList,
  "group": faThList,
  "grid": faThLarge,

  "arrowUp": faArrowUp,

  "date": faClock,
  "day": faClock,
  "month": faClock,
  "year": faClock,

  "close": faTimes,
  "cancel": faWindowClose,
  "star": faStar,
  "star-empty": faStarAndCrescent
}

const getIcon = (name) => {
  let ret = textToIcon[name]
  if (ret === undefined) {
    ret = faUserAstronaut
  }

  // console.log( "getIcon" , name, "->" ,  ret )
  return ret
}

export const Icon = ({ icon, className }) => {
  return (
    <FontAwesomeIcon icon={ getIcon(icon) } className={ className } />
  )
}
