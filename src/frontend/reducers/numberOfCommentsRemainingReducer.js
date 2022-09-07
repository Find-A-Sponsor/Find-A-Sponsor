import { createSlice } from "@reduxjs/toolkit";

const numberOfCommentsSlice = createSlice({
  name: 'numberOfComments',
  initialState: Array.from({length: 10}),
  reducers: {
    numberOfCommentsRemaining: {
      reducer (state, action) {
        const { content, key } = action.payload
        if (key === 'concat') {
          state = state.concat(content)
          console.log(state)
        } else {
          state = content
        }
        return state;
      },
      prepare(...args) {
        const content = args[0]
        const key = args[1]
        return {
          payload: {
            content,
            key
          }
        }
      }
    }
  },
})

export const { numberOfCommentsRemaining } = numberOfCommentsSlice.actions
export default numberOfCommentsSlice.reducer