import usersReducer from `${process.env.USERS_REDUCER}`
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import storeInformationReducer from `${process.env.STORE_INFORMATION_REDUCER}`
import postReducer from `${process.env.POST_REDUCER}`
import storePostReducer from `${process.env.STORE_POST_REDUCER}`
import commentReducer from `${process.env.COMMENT_REDUCER}`
import numberOfCommentsRemainingReducer from `${process.env.NUMBER_OF_COMMENTS_REDUCER}`

export const store = configureStore({
  reducer: {
    users: usersReducer,
    storage: storeInformationReducer,
    newPost: postReducer,
    posts: storePostReducer,
    comments: commentReducer,
    commentsRemaining: numberOfCommentsRemainingReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})