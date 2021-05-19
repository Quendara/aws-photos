
import React, { useState, useEffect } from "react";
import { Icon } from "./Icons";

// import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';

// import { setPhotos } from "../redux/actions";

const useStyles = makeStyles((theme) => ({

    speedDial: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(10),
    },
}));

export const MoveToTop = ( ) => {


    const classes = useStyles();
    
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
            return "btn-move-to-top  "
        }
        return "btn-move-to-top invisible  "

    }

    // <button color="primary" className={ getClassName( is_visible )} onClick={ scrollToTop }><Icon icon="arrowUp" /></button>
    return (
        <div className={ getClassName( is_visible )}  >
            
            <Fab color="secondary" variant="round" onClick={ scrollToTop }><Icon icon="arrowUp" /></Fab>
        </div>
    )
}


