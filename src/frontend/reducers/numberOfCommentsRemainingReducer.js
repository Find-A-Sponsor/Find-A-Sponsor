import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

const numberOfCommentsSlice = createSlice({
  name: 'numberOfComments',
  initialState: [],
  reducers: {
    numberOfCommentsRemaining: {
      reducer (state, action) {
        const { content, key, index } = action.payload
        if (key === 'concat') {
          state[index] = state[index].concat(content)
        } else if (key === 'initial') {
          state = content
        }
        return state;
      },
      prepare(...args) {
        const content = args[0]
        const key = args[1]
        const index = args?.[2]
        return {
          payload: {
            content,
            key,
            index
          }
        }
      }
    }
  },
})

export const { numberOfCommentsRemaining } = numberOfCommentsSlice.actions
export default numberOfCommentsSlice.reducer