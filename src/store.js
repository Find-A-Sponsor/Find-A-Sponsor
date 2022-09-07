import usersReducer from "../reducers/usersReducer";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import storeInformationReducer from "../reducers/storeInformationReducer";
import postReducer from "../reducers/postReducer";
import storePostReducer from "../reducers/storePostReducer";
import commentReducer from "../reducers/commentReducer";
import numberOfCommentsRemainingReducer from "../reducers/numberOfCommentsRemainingReducer";

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