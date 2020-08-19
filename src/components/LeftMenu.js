import React from "react";

import { TopList } from "./TopList";
import { TopAutoComplete } from "./TopAutoComplete";
import { TopListAuto } from "./TopListAuto";


import { Rating } from "./Rating";
import { Icon } from "./Icons";

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';


export const LeftMenu = ({ photos, query, callbackFilter }) => {

    return (
        <>
            <Grid item xs={ 11 } >
                <br />
                <Icon icon="rating" className="mr-2" />Rating
                            <div className="m-2 ml-4"><Rating rating={ query.rating } id="rating" callback={ callbackFilter } ></Rating></div>
                <br />
                <Divider variant="middle" />
                <br />


                <TopListAuto photos={ photos } title="year" icon="year" limit="10" sortByCount={ false } callback={ callbackFilter } />

                <TopList photos={ photos } title="faces" icon="faces" limit="10" sortByCount={ false } callback={ callbackFilter } />
                <br />
                <Divider variant="middle" />
                <br />

                { query.year.length > 0 &&
                    <>
                        <TopListAuto photos={ photos } title="month" icon="month" limit="12" sortByCount={ false } callback={ callbackFilter } />
                    </>
                }
                <TopListAuto photos={ photos } title="dirname" icon="dirname" sortByCount={ false } callback={ callbackFilter } />

                <Hidden mdDown>
                    <TopListAuto photos={ photos } title="country" icon="location" callback={ callbackFilter } />
                    <TopListAuto photos={ photos } title="city" icon="location" callback={ callbackFilter } />
                </Hidden>

            </Grid>

        </>
    )
}
