import React from "react";

export const SimpleImageList = ({ photos, deleteTodoHandle }) => {
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
                            
                            
                            
                            <h4>{image.country}</h4>
                            <h5>{image.city}</h5>
                            <div className="divider" />
                            {image.filename}

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
            {imageList}
        </div>
    );
};

