import usersReducer from "../frontend/src/reducers/usersReducer";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import storeInformationReducer from "../frontend/src/reducers/storeInformationReducer";
import postReducer from "../frontend/src/reducers/postReducer";
import storePostReducer from "../frontend/src/reducers/storePostReducer";
import commentReducer from "../frontend/src/reducers/commentReducer";
import numberOfCommentsRemainingReducer from "../frontend/src/reducers/numberOfCommentsRemainingReducer";

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