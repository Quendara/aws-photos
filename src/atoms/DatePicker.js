import React, { useState, useEffect } from "react";

import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';

import { getDateFromISOString } from "../components/helpers"

export const DatePicker = ({
    label = "Datum auswählen",
    callback // callback 
}) => {

    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {

        if (date !== null) {
            setSelectedDate(date);
            callback( getDateFromISOString(date) )
        }
    };


    return (
        <MuiPickersUtilsProvider utils={ DateFnsUtils } >
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                maskChar="."
                format="yyyy-MM-dd"
                value={ selectedDate }
                onChange={ handleDateChange }
                margin="normal"
                id="date-picker-inline"
                label={ label }
                KeyboardButtonProps={ {
                    'aria-label': 'change date',
                } }
            />
        </MuiPickersUtilsProvider>
    )
}