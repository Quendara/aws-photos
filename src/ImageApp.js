import React, { useState } from "react";
import Settings from "./Settings"
import { Images } from "./Images";
import { sortBy, groupBy } from "underscore";


const SimpleList = ({ items, title, callback }) => {

    return (
        <>
            <b>{title}</b>
            <div className="collection">

                {items.map((item, index) => (
                    <div className="collection-item" onClick={() => callback(item.value)} key={index}>{item.value}  <span class="badge">{item.count}</span> </div>
                ))}
            </div>
            <br />
        </>
    )
}

const SimpleImageList = ({ photos, deleteTodoHandle }) => {
    const imageList = photos.length ? (
        photos.map(image => {
            return (
                <div className="collection-item" key={image.id}>
                    <div className="row"
                        onClick={() => {
                            // deleteTodoHandle(image.id);
                        }}
                    >
                        <div className="col s2" >
                            <img className="responsive-img" src={image.src} />
                        </div>
                        <div className="col s10">
                            {image.id} - {image.src}
                        </div>
                    </div>
                </div>
            );
        })
    ) : (
            <p className="center">You have no images left</p>
        );

    return (
        <div className="collection">
            <h3 className="center blue-text">Images</h3>
            {imageList}
        </div>
    );
};

// This class contains the business logic of the application
const ImageApp = (props) => {

    const dummyLocations = []
    const dummyYear = []
    const dummyRating = []

    const [items, setItems] = useState([]);
    const [rating, setRating] = useState(dummyRating);
    const [year, setYear] = useState(dummyYear);
    const [location, setLocation] = useState(dummyLocations);

    // filtered
    const [current_items, setCurrentItems] = useState("");
    const [current_city, setCurrentCity] = useState("");
    const [current_year, setCurrentYear] = useState("");
    const [current_rating, setCurrentRating] = useState("");


    const filterFiles = (year, city, rating) => {




        const list = items.filter(image => {

            // return true keeps the item in the list
            const bool1 = year === "" || +image.year === +year
            const bool2 = rating === "" || +image.rating >= +rating
            const bool3 = city === "" || image.city === city

            // console.log("+image.year === +year : ", +image.year, year, +image.year === +year)
            console.log(bool1, bool3, bool3)
            return bool1, bool3, bool3
        })

        console.log("filterFiles year: ", year, list.length);
        console.log("filterFiles rating: ", rating, list.length);
        console.log("filterFiles city: ", city, list.length);



        setCurrentItems(list)
    };

    const findUnique = (list, group) => {
        let groups = groupBy(list, group);
        let uniqueItems = []
        for (var key in groups) {
            if (groups.hasOwnProperty(key)) {
                // console.log(key + " - " + groups[key]);

                const item = {
                    value: key,
                    count: groups[key].length
                }
                uniqueItems.push(item)

            }
        }
        // 
        uniqueItems = sortBy(uniqueItems, 'count'); // sort is ascending 
        uniqueItems = uniqueItems.reverse() // to reverse the order, of course replace with better impl

        console.log("uniqueItems : ", uniqueItems);
        return uniqueItems
    }

    const listFiles = () => {
        const options = {
            headers: {
                "Content-Type": "application/json",
                Authorization: props.token
            }
        };

        let mock = true
        if (mock) {
            const url = "test.json"
            fetch(url, options)
                .then(res => res.json())
                .then(
                    result => {
                        console.log("raw result : ", result)
                        let litems = result.map((x) => {

                            const ret = {
                                id: x.id,
                                src: Settings.baseS3Bucket + "thumbs/" + x.filename,
                                year: x.year,
                                month: x.month,
                                day: x.day,
                                width: x.width,
                                height: x.height,
                                country: x.country,
                                city: x.city,
                                rating: x.rating
                            };
                            return ret
                        })


                        //items = items.slice(2, 15) // reduce
                        console.log("items", litems)
                        setItems(litems)

                        // show the current items
                        const reduceditems = litems.slice(2, 15) // reduce
                        setCurrentItems(reduceditems)

                        let ratings = findUnique(result, "rating")
                        setRating(ratings)

                        let locations = findUnique(result, "city")
                        setLocation(locations)

                        let years = findUnique(result, "year")
                        setYear(years)


                    },
                    (error) => {
                        console.error("Could not load images : ", error.message);
                    }
                )

        }
        else {
            const url = Settings.baseAwsUrl + props.url;
            fetch(url, options)
                .then(res => res.json())
                .then(
                    result => {
                        console.log("raw result : ", result)
                        let litems = result.data.map((dataField) => {
                            return { src: Settings.baseS3Bucket + dataField.key, width: 1024, height: 768 };
                        })

                        console.log("items", litems)
                        setItems(litems)

                        const reduceditems = litems.slice(2, 15) // reduce
                        setCurrentItems(reduceditems)

                    },
                    (error) => {
                        console.error("Could not load images : ", error.message);
                    }
                )
        }
    }






    const callbackYear = (x) => {

        console.log("year : ", x)
        setCurrentYear(x)
        filterFiles(x, current_city, current_rating)

    }
    const callbackLocation = (x) => {
        console.log("loc : ", x)
        setCurrentCity(x)
        filterFiles(current_year, x, current_rating)
    }
    const callbackRating = (x) => {
        console.log("rating : ", x)
        setCurrentRating(x)
        filterFiles(current_year, current_city, x)
    }

    // <Images photos={current_items} />

    const imageApp = items.length ? (
        <SimpleImageList photos={current_items} />

    ) : (
            <div className="" >
                <p className="center">
                    No images loaded
                    <br />
                    <button className="btn" onClick={listFiles} >Load </button>
                </p>
            </div>
        )

    return (
        <>
            <div className="row">
                <div className="offset-s2 col s1 center">
                    {current_year}
                </div>
                <div className="col s1">
                    {current_rating}
                </div>
                <div className="col s1">
                    {current_city}
                </div>


            </div>


            <div className="row">
                <div className="col s2">



                    <SimpleList title="Year" items={year} callback={callbackYear} />
                    <SimpleList title="Rating" items={rating} callback={callbackRating} />
                    <SimpleList title="Locations" items={location} callback={callbackLocation} />


                </div>
                <div className="col s10">
                    {imageApp}
                </div>
            </div>
        </>

    )
}



export { ImageApp };
