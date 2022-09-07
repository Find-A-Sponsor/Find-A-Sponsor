/* eslint-disable no-use-before-define */
import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: "users",
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
        const content = args[0]
        const key = args[1]
        return {
          payload: {
            content,
            key,
          },
        }
      },
    },
    resetState(state) {
      // eslint-disable-next-line no-param-reassign
      state = {}
      return state
    },
  },
})

export const createUsers = (content, key) => async (dispatch) => {
  dispatch(createUser(content, key))
}

export const resetter = () => async (dispatch) => {
  dispatch(resetState())
}

export const { createUser, resetState } = userSlice.actions
export default userSlice.reducer
