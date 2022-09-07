import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: 'post',
  initialState: {},
  reducers: {
    createPosts: {
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
    resetState(state, action) {
      state = {}
      return state
    },
    editPosts: {
      reducer(state, action) {
        return state
      },
      prepare(...args) {
        console.log(args)
        return args
      }

    }
  },
})

export const createPost = (content, key) => {
  return async dispatch => {
    dispatch(createPosts(content, key))
  }
}

export const resetter = () => {
  return async dispatch => {
    dispatch(resetState())
  }
}

export const { createPosts, resetState, editPosts } = postSlice.actions
export default postSlice.reducer