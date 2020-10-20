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
