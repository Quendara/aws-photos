import React from "react";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { findUnique } from "./helpers"



export const TopAutoComplete = ({ photos, icon, title, sortByCount = true, limit = 1000, callback = undefined, rendering = "menu" }) => {
    const getItems = (photos) => {
        const group = title

        let locations = findUnique(photos, group, sortByCount, limit)
        return locations
    }

    const getResetClass = () => {
        return "badge"
    }

    return (

        //     <Autocomplete
        //     multiple
        //     limitTags={1}
        //     id="multiple-limit-tags"
        //     options={getItems( photos ) }
        //     getOptionLabel={(option) => option.value}            
        //     renderInput={(params) => (
        //     <TextField {...params} variant="outlined" label="limitTags" placeholder="Favorites" />
        //     )}
        // />
            <Autocomplete
                id={title}
                freeSolo
                options={ getItems( photos ) }
                getOptionLabel={ option => option.value }
                style={ { width: "100%" } }
                
                onChange={(event: any, newValue: string | null) => {

                    if( newValue == null ) { newValue = ""}
                    if (typeof newValue === 'string') {
                        // timeout to avoid instant validation of the dialog's form.
                        callback( title, newValue )                         
                      } else if (newValue && newValue.inputValue) {
                        callback( title, newValue) 
                      } else {
                        callback( title, newValue.value )
                      }
                    }}
                renderInput={ params => (
                    <TextField { ...params } label={title} variant="outlined" />
                ) }
            />
     
    )


}