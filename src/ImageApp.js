import React, { useState } from "react";
import Settings from "./Settings"
import { Images } from "./Images";


// This class contains the business logic of the application

const SimpleList = ({ items, title, callback }) => {


    return (
        <>
            <b>{title}</b>
            <ul class="list-group">
                {items.map((item, index) => (
                    <li class="list-group-item" onClick={ (item) => callback(item) } key={index}>{item} </li>
                ))}
            </ul>
            <br />
        </>
    )
}

const ImageApp = (props) => {

    const [items, setItems] = useState("");
    const [year, setYear] = useState("");
    const [location, setLocation] = useState("");

    const listFiles = () => {
        const options = {
            headers: {
                "Content-Type": "application/json",
                Authorization: props.token
            }
        };

        const url = Settings.baseAwsUrl + props.url;

        fetch(url, options)
            .then(res => res.json())
            .then(
                result => {

                    console.log("raw result : ", result)
                    let items = result.data.map(
                        (dataField) => {
                            return { src: Settings.baseS3Bucket + dataField.key, width: 1024, height: 768 };
                        })

                    console.log("items", items)

                    items = items.slice(2, 15) // reduce

                    setItems(items)
                },
                (error) => {
                    console.error("Could not load images : ", error.message);
                }
            )
    }


    const dummyLocations = ["Madeira", "Sizily", "Italy"]
    const dummyYear = ["2020", "2019", "2018"]

    const callbackYear = (year) => {
        console.log( "year : ", year )
        setYear(year)
        listFiles()
    }
    const callbackLocation = (loc) => {
        console.log( "loc : ", loc )

        setLocation(loc)
        listFiles()
    }

    return (
        <div class="row">
            <div class="col-md-2">

                <SimpleList title="Locations" items={dummyLocations} callback={callbackLocation} />

                <SimpleList title="Year" items={dummyYear} callback={callbackYear}  />
            </div>
            <div class="col-md-10">
                {items.length > 0 && <Images photos={items} />}
            </div>
        </div>

    )
}



export { ImageApp };
