import { combineReducers } from 'redux'
import { SET_RATING, SET_FILTER, SET_ACCESS_TOKEN, FETCH_DATA, SET_METADATA, ADD_TO_FILTER, REMOVE_FROM_FILTER, SEARCH_FACE } from "./actions"
import Settings from "../Settings"

// import { mockdataBerlin } from "../data/mockdata_Berlin.js"
// import { mockdataSizilien } from "../data/mockdata_Sizilien.js"
// import { mockdataMadeira } from "../data/mockdata_Madeira.js"
// import { mockdataHamburg } from "../data/mockdata_Hamburg.js"
// import { mockdataPrag } from "../data/mockdata_Prag.js"
// import { mockdataKroatien } from "../data/mockdata_Kroatien.js"
// import { mockdataDenHaag } from "../data/mockdata_DenHaag.js"
// import { mockdataItalien } from "../data/mockdata_Italien.js"

// import { mockdata } from "./data/mockdata_full"

// let mockdata = []
// mockdata = mockdata.concat(mockdataBerlin)
// mockdata = mockdata.concat(mockdataSizilien)
// mockdata = mockdata.concat(mockdataMadeira)
// mockdata = mockdata.concat(mockdataHamburg)
// mockdata = mockdata.concat(mockdataPrag)
// mockdata = mockdata.concat(mockdataKroatien)
// mockdata = mockdata.concat(mockdataDenHaag)
// mockdata = mockdata.concat(mockdataItalien)

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
        month: "",
        day: "",
        rating: "3",
        faces:[]
    },
    token: {
        access: ""
    }
}

const restCallToBackend = (url, token, loggingMessage = "Generic Call") => {

    // const url = Settings.baseRestApi + "/photos/" + id + "/rating/" + rating
    const options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: token // token.access
        },
    };

    console.log("restCallToBackend : ", url, token)
    fetch(url, options)
        .then(res => res.json() )
        // .then(res => JSON.parse( res ) )        
        .then(
            result => {
                const message = loggingMessage + " success"
                // console.log(message, result);                
                console.log(message);                
            },
            (error) => {
                
                const message = loggingMessage + " error:" + error.message
                alert( message );
                console.error(message, error.message);
            }
        )
        .catch(err => {
            const message = loggingMessage + " error (CATCHED)"
            alert( message );
            console.log(message, err)
        })
}





// var defaultState = 0;

// use defaultState as state
function photos(state = initial_state.photos, action) {

    switch (action.type) {
        case FETCH_DATA:
            return action.values

        case SEARCH_FACE:            
            const url = [Settings.baseRestApi, 'photos', action.id, 'find_faces' ].join("/")
            console.log( url )

            if (action.token !== undefined) {
                const url = [Settings.baseRestApi, 'photos', action.id, 'find_faces' ].join("/")
                const loggingMessage = "SEARCH_FACE"
                // restCallToBackend(url, action.token, loggingMessage)

                // setMetadataOnImage
                // store.dispatch({ type: 'SET_METADATA', action:{ id:"action.id", what:"faces", newValue:["Klaus"], token: action.token  } })

                // (async function () {
                //     let image = await restCallToBackendAsync(url, action.token, loggingMessage).then(data => {
                //         console.log(data)
                //         return state.map((image, index) => {
                //                 if (image.id === action.id) {
                //                     return Object.assign({}, image, {
                //                         faces: ["KLAUS"]
                //                     })
                //                 }
                //                 return image
                //             })
    
                //     }); 
                //     alert(image);
                //     return image
                //   })()

                
                
                return state.map((image, index) => {
                    if (image.id === action.id) {
                        return Object.assign({}, image, {
                            faces: ["KLAUS"]
                        })
                    }
                    return image
                })
            }            
 
            break;

        // case SET_FACES:
        //         // backend call
        //         if (action.token !== undefined) {
        //             const url = [Settings.baseRestApi, 'photos', action.id, 'faces', 'set', action.rating].join("/")
        //             const loggingMessage = "Update Rating"
        //             // restCallToBackend(url, action.token, loggingMessage)
        //         }
        //         else{
        //             console.warn( "SET_RATING (without TOKEN)" )
        //         }
        //         return state.map((image, index) => {
        //             if (image.id === action.id) {
        //                 return Object.assign({}, image, {
        //                     rating: action.rating
        //                 })
        //             }
        //             return image
        //         })            

            

        case SET_RATING:
            // backend call
            if (action.token !== undefined) {
                const url = [Settings.baseRestApi, 'photos', action.id, 'rating', action.rating].join("/")
                const loggingMessage = "Update Rating"
                restCallToBackend(url, action.token, loggingMessage)
            }
            else{
                console.warn( "SET_RATING (without TOKEN)" )
            }
            return state.map((image, index) => {
                if (image.id === action.id) {
                    return Object.assign({}, image, {
                        rating: action.rating
                    })
                }
                return image
            })
        case SET_METADATA:
            // backend call
            if (action.token !== undefined) {
                const url = [Settings.baseRestApi, 'photos', action.id, 'update', action.what, action.newValue ].join("/")
                const loggingMessage = "Update SET_METADATA"
                restCallToBackend(url, action.token, loggingMessage)
            }
            else{
                console.warn( "SET_METADATA (without TOKEN)" )
            }
            return state.map((image, index) => {

                if (image.id === action.id) {
                    let newObject = Object.assign({}, image )
                    if( action.what !== "dirname" ){
                        newObject[ action.what ] = action.newValue
                    }
                    else{                        
                        // newObject['dirname_physical'] = newObject.dirname // current value
                        newObject['dirname_logical'] = action.newValue // current value
                        // newObject[ action.what ] = newObject.dirname  // dirname == new logical value
                    }
                    
                    return newObject
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

    let query = Object.assign({}, state, {}) // make a copy of the current state

    switch (action.type) {
        case SET_FILTER:
            query[action.key] = action.value;
            console.log("query requcer : (key, value) ", action.key, action.value)
            return query

        case ADD_TO_FILTER:

            let currentValueX = query[action.key];
            let valueToAdd = []

            if( typeof currentValueX === "object" ){
                valueToAdd = currentValueX
            }

            // const multiple = action.value.split(",")

            if (action.value === "") {
                valueToAdd = []
            }
            // else if (multiple.length >= 2) {
            //     valueToAdd = multiple
            // }
            else {                
                valueToAdd.push(action.value)
            }

            query[action.key] = valueToAdd;
            console.log("ADD_TO_FILTER requcer : (key, value) ", action.key, action.value)
            console.log("ADD_TO_FILTER actual value is : ", action.key, valueToAdd)
            return query;

        case REMOVE_FROM_FILTER:

            let currentValue = query[action.key];
            
            const index = currentValue.indexOf(action.value)
            if (index >= 0) {
                currentValue.splice(index, 1); // index, how many
            // delete valueL[index];  
            }
            query[action.key] = currentValue

            console.log("REMOVE_FROM_FILTER requcer : (key, value) ", action.key, action.value)
            console.log("REMOVE_FROM_FILTER actual value is : ", action.key, currentValue)
            return query;
    


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

