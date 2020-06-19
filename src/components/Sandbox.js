import React, { useState } from "react";
import { Provider } from 'react-redux'



import SandboxList from "./SandboxList"

import { TopList } from "./TopList"
import { CancelFilter } from "./CancelFilter"


import { setQueryFilter } from "../redux/actions"; // import default 
import { rootReducer } from "../redux/reducer"; // import default 
import { createStore } from "redux";

// init with function
export const store = createStore(rootReducer)


store.subscribe(() => {
    console.log("state.subscribe", store.getState().query);
});

const callbackFilter = (key, value) => {
    store.dispatch(setQueryFilter(key, value));
}

const TestApi = ({ token }) => {

    const testApiCall = () => {
        const url = "https://g1pdih9v74.execute-api.eu-central-1.amazonaws.com/dev/photos"

        const options = {
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            }
        };

        console.log("CALL : ", url, token)

        // initial load of data

        fetch(url, options)
            .then(res => res.json())
            .then(
                result => {
                    console.log("result", result);
                    // store.dispatch(setPhotos(result))
                    // setItems(result);
                },
                (error) => {
                    console.error("Could not load links : ", error.message);
                }
            )
            .catch(err => { console.log("XX", err) })
    }

    return (
        <>
            <h1 onClick={ testApiCall }>Test </h1>
            { token.access }
        </>
    )

}





export const Sandbox = () => {

    return (
        <>
            <Provider store={ store } >
                <div className="row" >
                    <div className="col s3" >
                        <TopList photos={ store.getState().photos } title="rating" icon="rating" sortByCount={ false } callback={ callbackFilter } />
                        <TopList photos={ store.getState().photos } title="city" icon="city" sortByCount={ true } callback={ callbackFilter } />
                    </div>
                    <div className="col s9" >

                        <CancelFilter value={ store.getState().query.city } filter={ "city" } callback={ callbackFilter } />

                        <div className="divider" />

                        <TestApi token={ store.getState().token } />

                        <SandboxList />
                    </div>
                </div>

            </Provider>

        </>
    )
}
