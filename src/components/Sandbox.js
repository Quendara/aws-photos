import React, { useState } from "react";
import { Provider } from 'react-redux'



import SandboxList from "./SandboxList"

import { TopList } from "./TopList"
import { CancelFilter } from "./CancelFilter"


import { setFilter } from "../redux/actions"; // import default 

import { rootReducer } from "../redux/reducer"; // import default 

import { createStore } from "redux";

// init with function
export const store = createStore(rootReducer)


store.subscribe(() => {
    console.log("state.subscribe", store.getState().query );
});

const callbackFilter = (key, value) => {
    store.dispatch(setFilter(key, value) );
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
                        <SandboxList />
                    </div>
                </div>

            </Provider>

        </>
    )
}
