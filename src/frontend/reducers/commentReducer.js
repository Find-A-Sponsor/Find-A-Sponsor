import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

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
    },
    resetState (state, action) {
      state = []
      return state;
    },
    changeCommentStatus: {
      reducer (state, action) {
        let i = 0;
        state.storage.forEach((comment) => {
          if (comment._id === action.payload.commentId) {
            return;
          }
          i++
        })
        state.storage[i] = {
          ...state.storage[i],
          status: action.payload.status
        }
        return state;
      },
      prepare (...args) {
        const commentId = args[0]
        const status = args[1]
        return {
          payload: {
            commentId,
            status
          }
        }
      }
    },
    addImageOrGif: {
      reducer (state, action) {
        const { commentId, content, type } = action.payload  
        let i = 0;
        for (const comment of state.storage) {
          if (comment._id === commentId) {
            break;
          } else {
            i++;
          }
        }
        if (type.includes("gif")) {
          state.storage[i].gif = content
        } else if (type.includes("image")) {
          console.log(i);
          state.storage[i] = {
            ...state.storage[i],
            images: state.storage[i].images.concat(content)
          }
        }
        return state;
      },
      prepare (...args) {
        const commentId = args[0]
        const content = args[1]
        const type = args[2]
        return {
          payload: {
            commentId,
            content,
            type
          }
        }
      }
    },
    deleteMedia: {
      reducer (state, action) {
        const { commentId, type } = action.payload
        let i = 0;
        for (const comment of state.storage) {
          if (comment._id === commentId) {
            break;
          } else {
            i++;
          }
        }
        if (type === 'gif') {
          delete state.storage[i][type]
        } else if (type === "images") {
          state.storage[i][type] = []
        }
        return state;
      },
      prepare (...args) {
        const commentId = args[0]
        const type = args[1]
        return {
          payload : {
            commentId,
            type
          }
        }
      }
    }
  }
})

export const { createComment, storeComments, resetState, changeCommentStatus, addImageOrGif, deleteMedia } = commentSlice.actions
export default commentSlice.reducer