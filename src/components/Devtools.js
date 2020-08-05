import React, { useState } from "react";
import { Icon } from "./Icons"
// import { bindActionCreators } from "redux";
import { connect } from 'react-redux'

import Settings from "../Settings"

const Devtools = ({
    token               // from mapStateToProps    
}) => {

    const [message, setMessage] = useState("-");
    const [error, setError] = useState("");

    const updateCache = () => {
        const url = [Settings.baseRestApi, "photos"].join('/')
        callUrl(url)
    }

    const gps_find_missing_locations = () => {
        const url = [Settings.baseRestApi, "photos", "gps", "gps_find_missing_locations"].join('/')
        callUrl(url)
    }

    const gps_to_location = () => {
        const url = [Settings.baseRestApi, "photos", "gps", "gps_to_location"].join('/')
        callUrl(url)
    }




    const callUrl = (url) => {
        setMessage("Loading..." )
        setError("")

        const options = {
            headers: {
                "Content-Type": "application/json",
                Authorization: token.access
            }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(
                result => {
                    // console.log("result", result);
                    // store.dispatch(setPhotos(result))
                    setMessage(JSON.stringify(result));
                },
                (error) => {
                    console.error("Could not call URL : ", error.message);
                    setError(error.message)
                    setMessage( "FAILED" )
                }
            )
            .catch(err => { 
                console.error("XX", err) 
                setError( err )
                setMessage( "FAILED" )

            })


    }


    return (
        <div className="row">

            <h1>Devtools </h1>

            <h3>Gps </h3>
            <p>


                <button className="btn blue m-2" onClick={ gps_find_missing_locations }  >
                    <Icon icon="city" className="mr-2" /><b> Find Locations </b>
                </button>
            Scan images and lookop for city names and update gps to location database. <br />
            </p>

            <p>
                <button className="btn blue m-2" onClick={ gps_to_location }   >
                    <Icon icon="city" className="mr-2" /><b> Set city, country, state in images </b>
                </button>
            Scan images and replaces unresolved imagenames. <br />
            </p>

            <h3>Update Cache </h3>

            <button className="btn blue ml-2" onClick={ updateCache }  >
                <Icon icon="cache" className="mr-2" /><b> Update cache </b>
            </button>

            <h3>Response</h3>
            <div className="row" >
                <div className="col s6" >
                    <div className="blue" >
                        { message === "Loading..." &&
                            <div className="progress">
                                <div className="indeterminate"></div>
                            </div> }
                        <p className="m-2">{ message }</p>
                    </div>
                </div>
                <div className="col s6" >
                    <div className="red" >
                        <p className="m-2">{ error }</p>


                    </div>
                </div>
            </div>

        </div>

    )
}

const mapStateToProps = state => {

    const token = state.token

    console.log(token)

    return { 'token': token }
}

export default connect(mapStateToProps, null)(Devtools);