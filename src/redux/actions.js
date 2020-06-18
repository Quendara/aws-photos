export const  ADD_TODO = 'ADD_TODO'
export const  FETCH_DATA = 'FETCH_DATA'
export const  SET_RATING = 'SET_RATING'
export const  SET_FILTER = 'SET_FILTER'


// list of actions
export function addTodoById( id ) {
  const action = {
    type: ADD_TODO,
    id // == id:id
  }

  return action;
}

// list of actions
export function setPhotos( values ) {
  const action = {
    type: FETCH_DATA,
    values// == id:id
  }

  return action;
}

export function setRatingOnImage( id, rating ) {
  const action = {
    type: SET_RATING,
    id,
    rating // == rating:rating
  }

  return action;

}

export function setQueryFilter( key, value ) {
    const action = {
      type: SET_FILTER,
      key, // == rating:rating
      value
    }
  
    return action;
  
  }