import React, { useState } from "react";
import { Icon } from "./Icons"
// import { bindActionCreators } from "redux";
import { connect } from 'react-redux'
import Settings from "../Settings"
import Button from '@material-ui/core/Button';
import { useWindowSize } from "./useWindowSize"
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


const Devtools = ({
    token               // from mapStateToProps    
}) => {

    const [message, setMessage] = useState("-");
    const [error, setError] = useState("");

    const size = useWindowSize();

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
        setMessage("Loading...")
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
                    setMessage("FAILED")
                }
            )
            .catch(err => {
                console.error("XX", err)
                setError(err)
                setMessage("FAILED")

            })
    }

    const printMessage = ( message ) => {

        return message.slice( 0, 1000 )
        // if( typeof message === "string" )        {
        //     return message
        // }
        // return 
    }

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start" >


            <Grid item xs={ 12 } md={ 9 } >
                <Typography variant="h1" >Devtools</Typography>
                <Typography color="secondary"> Screensize : { size.width } x { size.height } </Typography>
                <Typography variant="h4" >Gps </Typography>
                <Button variant="contained" color="primary" onClick={ gps_find_missing_locations }  >
                    <Icon icon="city" className="mr-2" /><b> Find Locations </b>
                </Button>
                <p>
                    Scan images and lookop for city names and update gps to location database. <br />
                </p>

                <Button variant="contained" color="primary" onClick={ gps_to_location }   >
                    <Icon icon="city" className="mr-2" /><b> Set city, country, state in images </b>
                </Button>

                <p>
                    Scan images and replaces unresolved imagenames. <br />
                </p>
                <br />
                <Divider variant="middle" />
                <br />

                <Typography variant="h4" >Update Cache </Typography>
                <Button variant="contained" color="primary" onClick={ updateCache }  >
                    <Icon icon="cache" className="mr-2" /><b> Update cache </b>
                </Button> 
                <br />
                <br />
                <Divider variant="middle" />
                <br />

                <Typography variant="h4" >Response</Typography>

                Success
                <Card color="primary" >
                    <CardContent>
                        { printMessage( message ) }
                    </CardContent>
                </Card>

                <br/>Error
                <Card color="secondary" >
                    <CardContent>
                        { error }
                    </CardContent>

                </Card>



            </Grid>
        </Grid>

    )
}

const mapStateToProps = state => {

    const token = state.token

    console.log(token)

    return { 'token': token }
}

export default connect(mapStateToProps, null)(Devtools);