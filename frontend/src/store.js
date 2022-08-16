import usersReducer from "./reducers/usersReducer";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import storeInformationReducer from "./reducers/storeInformationReducer";
import postReducer from "./reducers/postReducer";
import storePostReducer from "./reducers/storePostReducer";
import commentReducer from "./reducers/commentReducer";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    storage: storeInformationReducer,
    newPost: postReducer,
    posts: storePostReducer,
    comments: commentReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})