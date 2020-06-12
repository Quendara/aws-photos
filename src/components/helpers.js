import { sortBy, groupBy } from "underscore";

export const findUnique = (list, group, sortByCount = true ) => {
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

    console.log("uniqueItems : ", uniqueItems);

    let sortByCriteria = 'value'
    if( sortByCount ){ sortByCriteria='count'}

    uniqueItems = sortBy(uniqueItems, sortByCriteria ); // sort (str) is ascending 
    uniqueItems = uniqueItems.reverse() // to reverse the order, of course replace with better impl

    console.log("uniqueItems (SORTED) : ", uniqueItems);
    return uniqueItems
}   


