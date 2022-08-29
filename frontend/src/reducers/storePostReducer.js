import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";
import { sortBy } from 'lodash'

const storePostSlice = createSlice({
  name: 'storage',
  initialState: [],
  reducers: {
    storePostInformation(state, action) {
      console.log(action.payload)
      console.log(current(state))
      const exists = state.find(post => post._id === action.payload._id)
      console.log(exists ? current(exists) : '')
      state.push(action.payload)
    },
    configureLikes (state, action) {
      state = sortBy(state, 'date').reverse()
      if (action.payload.message === 'increase') {
        state[action.payload.index].likes = state[action.payload.index].likes + 1
        state[action.payload.index].likedBy = state[action.payload.index].likedBy.concat(action.payload.currentId)
      } else if (action.payload.message === 'decrease') {
        state[action.payload.index].likes = state[action.payload.index].likes - 1
        state[action.payload.index].likedBy = state[action.payload.index].likedBy.filter(user => user !== action.payload.currentId)
      }
    },
    resetState (state, action) {
      state = []
      return state
    }
  }
})

export const { storePostInformation, configureLikes, resetState } = storePostSlice.actions
export default storePostSlice.reducer