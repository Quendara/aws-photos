export const ADD_TODO = 'ADD_TODO'
export const FETCH_DATA = 'FETCH_DATA'

// Image methods
export const SET_RATING = 'SET_RATING'
export const SET_METADATA = 'SET_METADATA'
export const SEARCH_FACE = 'SEARCH_FACE'

// Query
export const SET_FILTER = 'SET_FILTER'
export const ADD_TO_FILTER = 'ADD_TO_FILTER' // form Array lists in query
export const REMOVE_FROM_FILTER = 'REMOVE_FROM_FILTER'

export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'

// list of actions
export function addTodoById(id) {
  const action = {
    type: ADD_TODO,
    id // == id:id
  }

  return action;
}

// list of actions
export function setPhotos(values) {
  const action = {
    type: FETCH_DATA,
    values// == id:id
  }

  return action;
}

export function setAccessToken(token) {
  const action = {
    type: SET_ACCESS_TOKEN,
    token // == token:token
  }

  return action;
}

export function searchFaceOnImage(id, token = undefined) {
  const action = {
    type: SEARCH_FACE,
    id,    
    token
  }

  return action;
}

export function setRatingOnImage(id, rating, token = undefined) {
  const action = {
    type: SET_RATING,
    id,
    rating, // == rating:rating
    token
  }

  return action;
}

export function setMetadataOnImage(id, what, newValue, token = undefined) {
  const action = {
    type: SET_METADATA,
    id,
    what, // == what:what year, city, country, ...
    newValue,
    token
  }

  return action;
}

export function setQueryFilter(key, value) {
  const action = {
    type: SET_FILTER,
    key, // == rating:rating
    value
  }

  return action;
}

export function addToQueryFilter(key, value) {
  const action = {
    type: ADD_TO_FILTER,
    key, // == rating:rating
    value
  }

  return action;
}

export function removeFromQueryFilter(key, value) {
  const action = {
    type: REMOVE_FROM_FILTER,
    key, // == rating:rating
    value
  }

  return action;
}    