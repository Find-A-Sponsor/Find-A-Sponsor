import { createSlice } from "@reduxjs/toolkit";

const storePostSlice = createSlice({
  name: 'storage',
  initialState: {},
  reducers: {
    storePostInformation: {
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
    }
  })

export const { storePostInformation } = storePostSlice.actions
export default storePostSlice.reducer