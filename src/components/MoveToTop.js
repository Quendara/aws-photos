
import React, { useState, useEffect } from "react";
import { Icon } from "./Icons";
// import { setPhotos } from "../redux/actions";

export const MoveToTop = ( ) => {

    const [is_visible, setVisible] = useState(false);

    useEffect(() => {
        document.addEventListener("scroll", toggleVisibility );

        return () => {
            document.removeEventListener("scroll", toggleVisibility );
        };
    });    
    

    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }      

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setVisible( true )
        } else {
            setVisible( false )
        }
      }
    
    const getClassName = ( is_visible ) => {
        if( is_visible ){
            return "btn-move-to-top btn btn-large blue"
        }
        return "btn-move-to-top invisible btn btn-large blue"

    }

    return (
        <>
            <button className={ getClassName( is_visible )} onClick={ scrollToTop }><Icon icon="arrowUp" /></button>
        </>
    )
}


