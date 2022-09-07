import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'users',
  initialState: {},
  reducers: {
    createUser: {
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
    }
  },
})

export const createUsers = (content, key) => {
  return async dispatch => {
    dispatch(createUser(content, key))
  }
}

export const resetter = () => {
  return async dispatch => {
    dispatch(resetState())
  }
}

export const { createUser, resetState } = userSlice.actions
export default userSlice.reducer