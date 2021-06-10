import React from "react";

import { TopList } from "./TopList";
import { TopAutoComplete } from "./TopAutoComplete";
import { TopListAuto } from "./TopListAuto";


import { Rating } from "./Rating";
import { Icon } from "./Icons";

import { Grid, Card, CardContent, Box } from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';


export const LeftMenu = ({ photos, query, callbackFilter }) => {

    return (
        <Grid item xs={ 12 } >
            <br />
            <Box fontSize="h5.fontSize" >
            <div className="m-2 ml-4"><Rating rating={ query.rating } id="rating" callback={ callbackFilter } ></Rating></div>
            </Box>
            <br />
            <Divider variant="middle" />
            <br />


            <TopListAuto photos={ photos } title="year" icon="year" limit="99" sortByCount={ false } query={ query.year } callback={ callbackFilter } />

            <TopList photos={ photos } title="faces" icon="faces" limit="6" sortByCount={ false } callback={ callbackFilter } />
            <br />
            <Divider variant="middle" />
            <br />

            { query.year.length > 0 &&
                <>
                    <TopListAuto photos={ photos } title="month" icon="month" limit="12" query={ query.month } sortByCount={ false } callback={ callbackFilter } />
                </>
            }
            <TopListAuto photos={ photos } title="dirname" icon="dirname" query={ query.dirname } sortByCount={ false } callback={ callbackFilter } />

            <Hidden mdDown>
                <TopListAuto photos={ photos } title="country" icon="location" query={ query.country } callback={ callbackFilter } />
                <TopListAuto photos={ photos } title="city" icon="location" query={ query.city } callback={ callbackFilter } />
            </Hidden>
        </Grid>
    )
}
