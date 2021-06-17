import React, { useState } from "react"; // , { useState }

import { Grid, Card, CardHeader, List, ListItem, ListItemText, ListItemIcon, ListItemAvatar, ListItemSecondaryAction, Divider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Icon } from "./Icons";


import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import LanguageIcon from '@material-ui/icons/Language';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import AssignmentIcon from '@material-ui/icons/Assignment';

import CloseIcon from '@material-ui/icons/Close';

const ClipboardItem = ({ primary, secondary }) => {
    return (
        <>
            { primary &&
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <Icon icon={ secondary } />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={ primary } secondary={ secondary } />
                </ListItem>
            }
        </>

        )
    }

export const Clipboard = ({ country, state, city, folder, day, closeCallback }) => {

    // <li className="m-2">{ countryClipboard.length > 0 && <>{ countryClipboard }</> }</li>
    return (
                <List >
                    <ListItem>
                        <ListItemIcon>
                            <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Clipboard" />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={ closeCallback }>
                                <CloseIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />

                    <ClipboardItem primary={ country } secondary="country" />
                    <ClipboardItem primary={ state } secondary="state" />
                    <ClipboardItem primary={ city } secondary="city" />
                    <ClipboardItem primary={ day } secondary="day" />
                    <Divider />
                    <ClipboardItem primary={ folder } secondary="folder" />

                    {/* <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <LanguageIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={ country } secondary="country" />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <ImageIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={ state } secondary="state" />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <LocationCityIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={ city } secondary="city" />
                </ListItem> */}
                    {/* <Divider />
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <Icon icon="dirname" />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ folder } secondary="folder" />
            </ListItem> */}
                </List>

    )
}
