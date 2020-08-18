import React from "react";
import { Icon } from "./Icons"
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Chip from '@material-ui/core/Chip';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        spacing: {
            flexGrow: 1,
            '& > *': {
                margin: theme.spacing(0.5),
              }            

        }
    })
);

export const CancelFilterAll = ({ query, callbackFilter }) => {
    const classes = useStyles();

    return (
        <div className={classes.spacing}>
            <CancelFilter value={ query.sameday } filter={ "sameday" } callback={ callbackFilter } />
            <CancelFilter value={ query.dirname } filter={ "dirname" } callback={ callbackFilter } />
            <CancelFilter value={ query.year } filter={ "year" } callback={ callbackFilter } />
            <CancelFilter value={ query.month } filter={ "month" } callback={ callbackFilter } />
            <CancelFilter value={ query.day } filter={ "day" } callback={ callbackFilter } />
            {/* <CancelFilter value={ query.rating } filter="rating" callback={ callbackFilter } /> */}
            <CancelFilter value={ query.country } filter="country" callback={ callbackFilter } />
            <CancelFilter value={ query.state } filter="state" callback={ callbackFilter } />
            <CancelFilter value={ query.city } filter="city" callback={ callbackFilter } />
            <CancelFilter value={ query.faces } filter="faces" callback={ callbackFilter } />
            </div>
    )
}

const printQuery = (query) => {
    if (typeof query === "object") {
        return query.join(", ")
    }
    else {
        return query
    }
}

export const CancelFilter = ({ value, filter, callback }) => {

    return (
        <>
            { value.length > 0 &&
                <Chip onClick={ () => callback(filter, "") }
                    size="small"
                    icon={ <Icon icon={ filter }  /> }
                    label={ printQuery(value) }
                    color="secondary"
                    onDelete={ () => callback(filter, "") }

                />}
                    
                
        </>
    )
}

{/* <Button   onClick={ () => callback(filter, "") }  >
<Icon icon={ filter } className="mr-2" /><b>{ printQuery( value ) } </b><Icon icon="cancel" className="ml-2" />
</Button> } */}


// <button className="btn red m-2" onClick={ () => callbackFilter("faces", "" ) } >{ printQuery( query.faces ) }</button>
