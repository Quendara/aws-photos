import React, { useState } from "react"; // , { useState }

import { Grid, Card, CardHeader, Icon, List, ListItem, ListItemText, ListItemIcon, ListItemAvatar, Divider } from '@material-ui/core';

import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import LanguageIcon from '@material-ui/icons/Language';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import AssignmentIcon from '@material-ui/icons/Assignment';


export const Clipboard = ({ country, state, city }) => {

    // <li className="m-2">{ countryClipboard.length > 0 && <>{ countryClipboard }</> }</li>
    return (
            <List >
                <ListItem>
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Clipboard" />
                </ListItem>
                <Divider />
                <ListItem>
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
                </ListItem>
            </List>
        
    )
}
