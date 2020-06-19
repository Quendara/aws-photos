import { combineReducers } from 'redux'
import { SET_RATING, SET_FILTER, SET_ACCESS_TOKEN, FETCH_DATA } from "./actions"

import { mockdataBerlin } from "../data/mockdata_Berlin.js"
import { mockdataSizilien } from "../data/mockdata_Sizilien.js"
import { mockdataMadeira } from "../data/mockdata_Madeira.js"
import { mockdataHamburg } from "../data/mockdata_Hamburg.js"
import { mockdataPrag } from "../data/mockdata_Prag.js"
import { mockdataKroatien } from "../data/mockdata_Kroatien.js"
import { mockdataDenHaag } from "../data/mockdata_DenHaag.js"
import { mockdataItalien } from "../data/mockdata_Italien.js"

// import { mockdata } from "./data/mockdata_full"

let mockdata = []
mockdata = mockdata.concat(mockdataBerlin)
mockdata = mockdata.concat(mockdataSizilien)
mockdata = mockdata.concat(mockdataMadeira)
mockdata = mockdata.concat(mockdataHamburg)
mockdata = mockdata.concat(mockdataPrag)
mockdata = mockdata.concat(mockdataKroatien)
mockdata = mockdata.concat(mockdataDenHaag)
mockdata = mockdata.concat(mockdataItalien)

//https://g1pdih9v74.execute-api.eu-central-1.amazonaws.com/dev/photos

// mockdata = mockdata.slice(0, 5)

const initial_state = {
    photos: [], // mockdata,
    query: {
        country: "",
        state: "",
        city: "",
        sameday: "",
        dirname: "",
        year: "",
        rating: ""
    },
    token: {
        access: ""
    }
}


// var defaultState = 0;

// use defaultState as state
function photos(state = initial_state.photos, action) {

    switch (action.type) {
        case FETCH_DATA:
            return action.values

        case SET_RATING:
            return state.map((image, index) => {
                if (image.id === action.id) {
                    return Object.assign({}, image, {
                        rating: action.rating
                    })
                }
                return image
            })


        default:
            return state
    }
}

// use defaultState as state
function token(state = initial_state.token, action) {

    switch (action.type) {
        case SET_ACCESS_TOKEN:
            // return tocken as new object
            return Object.assign({}, state, {
                 access: action.token
            })            
        default:
            return state
    }
}

function query(state = initial_state.query, action) {

    let query = {
        country: state.country,
        state: state.state,
        city: state.city,
        sameday: state.sameday,
        dirname: state.dirname,
        year: state.year,
        rating: state.rating
    }

    switch (action.type) {
        case SET_FILTER:
            query[action.key] = action.value
            return query
        default:
            return state
    }
}


export const rootReducer = combineReducers({ photos, query, token })



// store.dispatch({ type: 'TEST' })
// 1
// store.dispatch({ type: 'INCREMENT' })
// store.dispatch({ type: 'INCREMENT' })
// store.dispatch({ type: 'INCREMENT' })
// 2

// export default { store };

