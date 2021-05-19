import React, { Component, useState } from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { createMuiTheme } from "@material-ui/core/styles";
import { purple, lightGreen, pink, lightBlue, red } from '@material-ui/core/colors/';


export const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: lightBlue,
        secondary: pink,
        danger: red
    }
});

export const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        spacing: {
            flexGrow: 1,
            '& > *': {
                margin: theme.spacing(0.5),
            }
        },
        menuButton: {
            marginRight: theme.spacing(6),
            color: "#FFFFFF",
            textDecoration: "none"
        },
        title: {
            flexGrow: 1,
            color: "#FFFFFF",
            textDecoration: "none"
        },
        selected: {
            color: "#FFFF00",
        }    
    }),
);


// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       flexGrow: 1,
//     },
//     menuButton: {
//       marginRight: theme.spacing(6),
//       color: "#FFFFFF",
//       textDecoration: "none"
//     },
//     title: {
//       flexGrow: 1,
//       color: "#FFFFFF",
//       textDecoration: "none"
//     },
//     selected: {
//       color: "#FFFF00",
//     },
//     modal : {
//       position: 'absolute',
//       width: 400,
//       backgroundColor: theme.palette.background.paper,
//       // border: '2px solid #000',
//       boxShadow: theme.shadows[5],
//       padding: theme.spacing(2, 4, 3),
//     },    
//   }),
// );