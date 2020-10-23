import React, { useState } from "react"; // { useState, useCallback } 
import ImageGroup from "./ImageGroup"; // import without {}
import { leadingZeros } from "./helpers";

import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';




export const ImageToday = ({ photos, flavor, setQueryFilter, sortBy }) => {

    // const d = 
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setDate(date)
    };

    const nextDay = () => {
        console.log("nextDay")

        let d = new Date(date)
        d.setDate(d.getDate() + 1);
        setDate(d)
    }
    const previousDay = () => {
        console.log("previousDay")

        let d = new Date(date)
        d.setDate(d.getDate() - 1);
        setDate(d)
    }

    const findTodaysPhotos = (images) => {

        let today = leadingZeros(date.getMonth() + 1)
        today += "-" + leadingZeros(date.getDate())

        const list = images.filter(image => {
            return (image.sameday === today)
        })
        return list;
    }
    const todaysPhotos = findTodaysPhotos(photos);

    const findImportedPhotos = (images) => {

        let imported = "" + date.getFullYear()
        imported += "-" + leadingZeros(date.getMonth() + 1)
        imported += "-" + leadingZeros(date.getDate())

        console.log(imported)

        const list = images.filter(image => {
            return (image.imported === imported)
        })
        return list;
    }
    const importedPhotos = findImportedPhotos(photos);

    // index must be 0..1, example from date.getMonth()
    const getMonthName = (index) => {
        const array = ["Jannuar", "Feburar", "März", "April", "Mai", "Juni", "July", "August"]
        return array[index]
    }

    const renderToday = () => {
        return (<>
            <Grid container justify="space-around">
                <h4>
                    <span role="img" aria-label="Panda" style={ { fontSize: "1.3em" } } >☀️</span>
                    <span onClick={ previousDay } className="mouse-pointer grey-text text-darken-1" >
                        Erinnerungen an den
                        </span>
                    <span onClick={ nextDay } style={ { fontSize: "1.3em" } } className="mouse-pointer cyan-text " >
                        { " " }    { date.getDate() }.  { getMonthName(date.getMonth()) }
                    </span>
                </h4>
                <MuiPickersUtilsProvider utils={ DateFnsUtils } >
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="yyyy-MM-dd"
                        margin="normal"
                        id="date-picker-inline"
                        label="Datum auswählen"
                        value={ selectedDate }
                        onChange={ handleDateChange }
                        KeyboardButtonProps={ {
                            'aria-label': 'change date',
                        } }
                    />
                </MuiPickersUtilsProvider>
            </Grid>


            { todaysPhotos.length > 0 ?
                (<ImageGroup photos={ todaysPhotos } sortBy={ sortBy } initialGroup="year" showGroupSelector={ false } />)
                : (<>
                    <div className="card-panel blue darken-4 " >
                        <h3 className="blue-text text-lighten-4 center">Keine Fotos von diesem Tag.</h3>
                    </div>
                </>) }
        </>)
    }

    const renderImported = () => {
        return (<>
            <Grid container justify="space-around">
                <h4>
                    <span onClick={ previousDay } className="mouse-pointer grey-text text-darken-1" >
                        Importiert am
                        </span>
                    <span onClick={ nextDay } style={ { fontSize: "1.3em" } } className="mouse-pointer cyan-text " >
                        { " " }    { date.getDate() }.  { getMonthName(date.getMonth()) }
                    </span>
                </h4>
                <MuiPickersUtilsProvider utils={ DateFnsUtils } >
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="yyyy-MM-dd"
                        margin="normal"
                        id="date-picker-inline"
                        label="Datum auswählen"
                        value={ selectedDate }
                        onChange={ handleDateChange }
                        KeyboardButtonProps={ {
                            'aria-label': 'change date',
                        } }
                    />
                </MuiPickersUtilsProvider>
            </Grid>

            { importedPhotos.length > 0 ?
                (<ImageGroup photos={ importedPhotos } sortBy={ sortBy } initialGroup="year" showGroupSelector={ false } />)
                : (<>
                    <div className="card-panel blue darken-4 " >
                        <h3 className="blue-text text-lighten-4 center">Keine Fotos von diesem Tag.</h3>
                    </div>
                </>) }

        </>)
    }

    const what = () => {
        if (flavor === "today") {
            return renderToday()
        }
        else {
            return renderImported()
        }

    }




    return what()

}