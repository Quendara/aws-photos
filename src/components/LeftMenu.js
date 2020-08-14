import React from "react";

import { TopList } from "./TopList";
import { Rating } from "./Rating";
import { Icon } from "./Icons";

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';


export const LeftMenu = ({ photos, query, callbackFilter }) => {

    return (
        <>
            <Grid item xs={ 12 } >
                <br />
                <Icon icon="rating" className="mr-2" />Rating
                            <span className="m-2"><Rating rating={ query.rating } id="rating" callback={ callbackFilter } ></Rating></span>
                <br />
                <Divider variant="middle" />
                <br />
            </Grid>

            <TopList photos={ photos } title="year" icon="year" limit="10" sortByCount={ false } callback={ callbackFilter } />

            { query.year.length > 0 &&
                <>
                    <TopList photos={ photos } title="month" icon="month" limit="12" sortByCount={ false } callback={ callbackFilter } />
                </>
            }
            <TopList photos={ photos } title="dirname" icon="dirname" limit="9" sortByCount={ false } callback={ callbackFilter } />

            {/* <div className="hide-on-med-and-down"></div> */ }
            <Hidden mdDown>
                <TopList photos={ photos } title="country" icon="location" limit="5" callback={ callbackFilter } />
                <TopList photos={ photos } title="state" icon="location" limit="5" callback={ callbackFilter } />
                <TopList photos={ photos } title="city" icon="location" limit="5" callback={ callbackFilter } />
            </Hidden>

        </>
    )
}
