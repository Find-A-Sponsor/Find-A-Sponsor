import { createSlice } from "@reduxjs/toolkit";

const storeInformationSlice = createSlice({
  name: 'storage',
  initialState: {},
  reducers: {
    storeUserInformation: {
      reducer(state, action) {
        const {content, keys} = action.payload
        return {
          ...state,
          [keys]: content
        }
      }, 
      prepare(...args) {
        let content = args[0];
        let keys = args[1];
        return {
          payload: {
            content,
            keys
          }
        }
      }
    }
  }
})



export const storeUser = (content) => {
  return async dispatch => {
    dispatch(storeUserInformation(content))
  }
}

export const { storeUserInformation } = storeInformationSlice.actions
export default storeInformationSlice.reducer