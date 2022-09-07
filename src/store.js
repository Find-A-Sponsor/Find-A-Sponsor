/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line no-unused-vars
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import usersReducer from "./frontend/reducers/usersReducer";
import storeInformationReducer from "./frontend/reducers/storeInformationReducer";
import postReducer from "./frontend/reducers/postReducer";
import storePostReducer from "./frontend/reducers/storePostReducer";
import commentReducer from "./frontend/reducers/commentReducer";
import numberOfCommentsRemainingReducer from "./frontend/reducers/numberOfCommentsRemainingReducer";

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