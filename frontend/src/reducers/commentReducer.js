import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: 'comment',
  initialState: {},
  reducers: {
    createComment: {
      reducer(state, action) {
        const { content, key } = action.payload
        return {
          ...state,
          [key]: content,
        }
      },
      prepare(...args) {
        let content = args[0];
        let key = args[1];
        return {
          payload: {
            content,
            key
          }
        }
      },
    },
    storeComments (state, action) {
      const { storage } = action.payload
      return {
        ...state,
        storage
      }
    }
  },
})

export const { createComment, storeComments } = commentSlice.actions
export default commentSlice.reducer