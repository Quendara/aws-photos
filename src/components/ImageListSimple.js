import React from "react";
import { Rating } from "./Rating"

export const ImageListSimple = ({ photos, deleteTodoHandle }) => {
    const imageList = photos.length ? (
        photos.map(image => {
            return (
                <div className="row " key={image.id}>
                    <div className=" "
                        onClick={() => {
                            // deleteTodoHandle(image.id);
                        }}
                    >
                        <div className="col s6 m2" >
                            <img className="responsive-img" src={image.src} />
                        </div>
                        <div className="col s6 m10">
                            <span class="badge">{image.dirname} / {image.filename}</span>                            
                            <h5>{image.country}</h5>
                            <h6>{image.city}</h6>
                            <Rating rating={image.rating}></Rating>
                        </div>

                    </div>
                </div>
            );
        })
    ) : (
            <p className="center">You have no images left</p>
        );

    return (
        <>
            {imageList}
        </>
    );
};

