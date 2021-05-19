import React, { useState } from 'react';
import { Icon } from "./Icons"
// import Button from '@material-ui/core/Button';
// import ButtonGroup from '@material-ui/core/ButtonGroup';

import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

    speedDial: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));


export const SelectionView = ({ valueArr, keyArr, iconsOnly, currentValue, callback }) => {

    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const getClass = (item) => {
        if (item === currentValue) {
            return "default"
        }
        else {
            return "primary"
        }
    }

    const callbackLocal = (item) => {
        if (callback !== undefined) {
            callback(item)
        }
        else {
            console.error("callback is not defined")
        }
    }

    const getItemName = (item) => {
        if (iconsOnly) return ""
        return item;
    }

    return (

    <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        className={ classes.speedDial }
        icon={ <SpeedDialIcon /> }
        onClose={ handleClose }
        onOpen={ handleOpen }
        open={ open }
    >
        { valueArr.map((item, index) => (
            <SpeedDialAction
                key={ getItemName(item) }
                icon={ <Icon icon={ item } /> }
                tooltipTitle={ getItemName(item) }
                tooltipOpen
                onClick={ () => { callbackLocal(item); handleClose() } } />
        )) }
    </SpeedDial> 
    )

    // return (
    //     <ButtonGroup size="small" variant="contained"  >
    //         { valueArr.map((item, index) => {
    //             return (
    //                 <Button key={ index } color={ getClass(item) } onClick={ () => callbackLocal(item) } >
    //                     { iconsOnly && <Icon icon={ item } className="ml-2 mr-2" /> }
    //                     { getItemName(item) }
    //                     </Button>
    //             )
    //         }) }
    //     </ButtonGroup>
    // )
}





