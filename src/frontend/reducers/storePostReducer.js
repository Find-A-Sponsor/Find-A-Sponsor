import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";
import { sortBy } from 'lodash'

const storePostSlice = createSlice({
  name: 'storage',
  initialState: [],
  reducers: {
    storePostInformation(state, action) {
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
    },
    addImages: {
      reducer(state, action) {
        state[action.payload.index].images = state[action.payload.index].images.concat(action.payload.content)
        console.log(current(state))
        return state
      },
      prepare(...args) {
        const index = args[0]
        const content = args[1]
        return {
          payload: {
            index,
            content
          }
        }
      }
    },
    editPost: {
      reducer(state, action) {
        const index = state.findIndex(post => post._id === action.payload.id)
        state[index].text = action.payload.text
        return state
      },
      prepare(...args) {
        const text = args[0]
        const id = args[1][0]._id
        return {
          payload: {
            id,
            text
          }
        }  
      }
    },
    eraseNewImages: {
      reducer(state, action) {
        state[action.payload.index].images = state[action.payload.index].images.slice(0, -action.payload.amountToRemove)
        return state
      },
      prepare(...args) {
        const index = args[0]
        const amountToRemove = args[1]
        return {
          payload: {
            index,
            amountToRemove
          }
        }
      }
    }
  }
})

export const { storePostInformation, configureLikes, resetState, addImages, eraseNewImages, editPost } = storePostSlice.actions
export default storePostSlice.reducer