import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const SET_RECEIPT = 'SET_RECEIPT'

/**
 * ACTION CREATORS
 */
export const setReceipt = receipt => ({type: SET_RECEIPT, receipt})
/**
 * THUNK CREATORS
 */

export function addReceipt(receiptImg) {
  return function thunk(dispatch) {
    return axios.get(`/api/s3/clean`,{receiptImg})
      .then(res => res.data)
      .then(receipt => {
        console.log('here is parsed receipt', receipt)
        dispatch(setReceipt(receipt));
      })
    }
  } 

export function setReceiptToOrderHistory(currentReceipt) {
  return function thunk(dispatch) {
    return axios.post(`/api/receipts/add`, {currentReceipt})
      .then(res => res.data)
      .then(succ => {
        dispatch(setReceipt({})); 
      })
  }
}

export function setReceiptToIngredients(currentIngredients) {
  return function thunk(dispatch) {
    return axios.put(`/api/receipts/categories`, {currentIngredients}); 
  }
}

export function setReceiptToRepresentations(currentRepresentations) {
  return function thunk(dispatch) {
    console.log(currentRepresentations); 
    return axios.put(`/api/receipts/representations`, {currentRepresentations}); 
  }
}


export function setFrequencyForItem(receiptItem) {
  return function thunk(dispatch) {
    return axios.post(`/api/receipts/frequency`, {receiptItem})
  }
}

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case SET_RECEIPT:
      return action.receipt
    default:
      return state
  }
}
