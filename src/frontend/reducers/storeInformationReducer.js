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
    },
    storePostURLs: {
      reducers(state, action) {
        const { content, key } = action.payload
        return {
          ...state,
          [key]: content
        }

      },
      prepare(...args) {
        console.log(args)
        let content = args[0]
        let key = args[1]
        return {
          payload: {
            content,
            key
          }
        }
      }
    }
    }
  })



export const storeUser = (content, key) => {
  return async dispatch => {
    dispatch(storeUserInformation(content, key))
  }
}

export const { storeUserInformation, storePostURLs } = storeInformationSlice.actions
export default storeInformationSlice.reducer