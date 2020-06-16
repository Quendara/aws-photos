export const  ADD_TODO = 'ADD_TODO'
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

export function setRatingOnImage( id, rating ) {
  const action = {
    type: SET_RATING,
    id,
    rating // == rating:rating
  }

  return action;

}

export function setFilter( key, value ) {
    const action = {
      type: SET_FILTER,
      key, // == rating:rating
      value
    }
  
    return action;
  
  }