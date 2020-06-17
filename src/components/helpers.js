import { sortBy, groupBy } from "underscore";

export const sortPhotos = (images, sortByKey = 'rating', ascending=false) => {
    images = sortBy(images, sortByKey);
    if( !ascending ){
        images = images.reverse()
    }
    return images; // .slice(0, 5);
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

export const leadingZeros = (num, size=2) => {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

