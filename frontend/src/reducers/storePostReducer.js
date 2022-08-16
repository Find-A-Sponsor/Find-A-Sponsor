import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

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
    configureLikes (state, action) {
      if (action.payload.message === 'increase') {
        state[action.payload.index].likes = state[action.payload.index].likes + 1
        state[action.payload.index].likedBy = state[action.payload.index].likedBy.concat(action.payload.currentId)
      } else if (action.payload.message === 'decrease') {
        state[action.payload.index].likes = state[action.payload.index].likes - 1
        state[action.payload.index].likedBy = state[action.payload.index].likedBy.filter(user => user !== action.payload.currentId)
      }
      return state;
    }
    }
  })

export const { storePostInformation, configureLikes } = storePostSlice.actions
export default storePostSlice.reducer