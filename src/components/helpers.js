import { sortBy, groupBy, shuffle, reduce } from "underscore";
import {Settings} from "../Settings"

export const sortPhotos = (images, sortByKey = 'rating', ascending=false) => {
    images = sortBy(images, sortByKey);
    if( !ascending ){
        images = images.reverse()
    }
    return images; // .slice(0, 5);
}


export const shuffleItems = ( list ) => {
    return shuffle(list)
}

export const sumArray = ( list, key ) => {
    // return reduce( list, function(memo, num){ return memo + num[key]; }, 0);
    let sum = 0;
    list.map( (item, index)  => { sum += item[key] } )
    return sum
}

export const findUnique = ( list, group, sortByCount = true, limit=5 ) => {
    let groups = groupBy(list, group);
    let uniqueItems = []
    for (var key in groups) {
        if (groups.hasOwnProperty(key)) {
            // console.log(key + " - " + groups[key]);

            const item = {
                value: key,
                count: groups[key].length,
                photos: groups[key]
            }
            uniqueItems.push(item)
        }
    }
    // 

    // console.log("uniqueItems : ", uniqueItems);

    let sortByCriteria = 'value'
    if( sortByCount ){ sortByCriteria='count'}

    uniqueItems = sortBy(uniqueItems, sortByCriteria ); // sort (str) is ascending 
    uniqueItems = uniqueItems.reverse() // to reverse the order, of course replace with better impl

    // console.log("uniqueItems (SORTED) : ", uniqueItems);
    return uniqueItems.slice(0, limit) // reduce
}  

const helperAddFacenameToUnique = ( name, image, uniqueNames ) => {

    if( name === undefined ) {
        console.error( "name is undefined" )
    }
    
    
    if( uniqueNames[name] === undefined ) {                    
        // new element                                        
        uniqueNames[name] = {
            value: name,
            //count: 1,
            photos: [ image ]
        }   
    }
    else{
        // name exist
        uniqueNames[name].photos.push( image )
    }
}

export async function restCallToBackendAsync(url, token, loggingMessage = "Generic Call")
{
    const options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: token // token.access
        },
    };

  let response = await fetch(url, options)
  let data = await response.json()
  return data;
}


export const findUniqueFacesItems = ( photos, singlePerson = true, limit = 100) => {
    const group = "faces"
    const sortByCount = true        

    // let faces = findUnique(photos, group, sortByCount, limit)
    
    let uniqueNames = {}

    for (let i = 0; i < photos.length; i++) {
        const image = photos[i]
        const faces_on_image = photos[i].faces
        // console.log( typeof faces_on_image )
        if( typeof faces_on_image === "object" )
        {
            if( faces_on_image.length === 1 ) {
                const name = faces_on_image[0]
                helperAddFacenameToUnique( name, image, uniqueNames )                
            }
            else {
                for (let n = 0; n < faces_on_image.length; n++) {
                    const name = faces_on_image[n]
                    helperAddFacenameToUnique( name, image, uniqueNames )                
                }
            }
        }
    }

    // transform
    let uniqueItems = []
    for (var name in uniqueNames) {

        const item = {
            value: name,            
            photos: uniqueNames[name].photos,
            count: uniqueNames[name].photos.length
        }
        
        uniqueItems.push(item)
    }

    let sortByCriteria = 'value'
    if( sortByCount ){ sortByCriteria='count'}

    uniqueItems = sortBy(uniqueItems, sortByCriteria ); // sort (str) is ascending 
    uniqueItems = uniqueItems.reverse() // to reverse the order, of course replace with better impl

    return uniqueItems.slice(0, limit) 

    
}

export const leadingZeros = (num, size=2) => {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

export const filterFiles = (images, query) => {

    const list = images.filter(image => {

        // filter all below 0
        // missing & deleted -1

        let rating = 0;
        if (query.rating !== "") {
            rating = query.rating
        }

        const boolWidth = image.width !== 666 // remove images with the initial width of 666 (error state)

        const bool1 = +image.rating >= rating

        // return true keeps the item in the list
        const bool2 = query.year === undefined || query.year === "" || +image.year === +query.year // true when year is not given or equel
        const bool3 = query.dirname === undefined || query.dirname === "" || image.dirname === query.dirname

        if (boolWidth === false || bool1 === false || bool2 === false || bool3 === false) { // if one is false return false, skip this photo
            return false; // realy exit
        }

        const bool4 = query.month === undefined || query.month === "" || image.month === query.month
        const bool5 = query.day === undefined || query.day === "" || image.day === query.day
        const bool6 = query.sameday === undefined || query.sameday === "" || image.sameday === query.sameday

        const bool7 = query.country === undefined || query.country === "" || image.country === query.country
        const bool8 = query.state === undefined || query.state === "" || image.state === query.state
        const bool9 = query.city === undefined || query.city === "" || image.city === query.city
        const boolX = query.faces === undefined || query.faces === "" || query.faces.length === 0  || imageHasFace( image.faces, query.faces )


        // console.log("+image.year === +year : ", +image.year, year, +image.year === +year)
        // console.log(bool1, bool2, bool3)
        // #return (bool1 && bool2 && bool3 && bool4 && bool5 && bool6 && bool7 && bool8 && bool9)
        return (bool4 && bool5 && bool6 && bool7 && bool8 && bool9 && boolX)
    })

    console.log("filterFiles : ", list.length);

    // updateViews(list)
    // setCurrentItems(list)
    return list
};

const imageHasFace = ( image, query ) => {
    if( image === undefined ) return false;

    let retBool = true; 

    // console.log( "query : ", query)

    for ( let name of query){ // in returns the 
        // console.log( "let name in query", image,  name )
        retBool = retBool && image.includes( name )
    }

    // console.log( "retBool", retBool)

    return retBool
}

export const getDateFromISOString = ( date ) => {

    let retstr = "" + date.getFullYear()
    retstr += "-" + leadingZeros(date.getMonth() + 1)
    retstr += "-" + leadingZeros(date.getDate())

    return retstr
}

export const getDateFormatedISODate = ( date ) => {

    let retstr = "" + date.getFullYear()
    retstr += "-" + leadingZeros(date.getMonth() + 1)
    retstr += "-" + leadingZeros(date.getDate())

    return retstr
}

export const getDateFormatedTime = ( date ) => {

    let retstr = "" 
    retstr += leadingZeros(date.getHours())
    retstr += "." + leadingZeros(date.getMinutes())
    retstr += "." + leadingZeros(date.getSeconds())
    retstr += "." + leadingZeros(date.getMilliseconds(),3)

    return retstr
}

export const addSrcAndDirname = (images) => {

    // const reduceditems = images.slice(0, size) // reduce    

    return images.map((image) => {

        let retImage = Object.assign({}, image)

        // let retImage = image

        if (image.country === undefined) { retImage['country'] = "-" }
        if (image.city === undefined) { retImage['city'] = "-" }
        if (image.state === undefined) { retImage['state' ] = "-" } 

        if (image.date !== undefined) {

            const dateObj = new Date( retImage['date'] )

            if( isNaN( dateObj ) ){
                console.error( "dateObj is NaN", retImage['date']  )
            }
            
            // 2018-03-14T00:00:00                   
            retImage['year']    = "" + dateObj.getFullYear() // "2018"
            retImage['month']   = "" + dateObj.getFullYear() + "-" + leadingZeros( dateObj.getMonth()+1 )  // "2018-03",
            retImage['day']     = getDateFromISOString( dateObj ) // "2018-03-14",
            retImage['sameday'] = leadingZeros( dateObj.getMonth() )  +"-"+ leadingZeros( dateObj.getDate() )  // "03-14",            

         }

        if (image.faces !== undefined) { 

            retImage['faces'] = image.faces.sort() 
            retImage['nFaces'] = image.faces.length
        }  
        else{
            retImage['nFaces'] = 0
        }


        retImage["source_url"] = [Settings.baseApiBinaryImages, image.dirname, image.filename].join('/')
        retImage["src"] = image.id
        retImage["rating"] = +image.rating

        if (image.dirname_logical !== undefined) {
            retImage['dirname_physical'] = image.dirname
            retImage.dirname = image.dirname_logical
        }

        // swap width height when image is rotated
        if (image.orientation === "90CW" || image.orientation === "90CCW") {
            const oldWidth = image.width
            retImage.width = image.height
            retImage.height = oldWidth
        }

        if (image.width === undefined) {
            console.error("width is invalid : ", image.filename)
        }


        return retImage
    })
}