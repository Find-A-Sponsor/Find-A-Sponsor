import usersReducer from "./reducers/usersReducer";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import storeInformationReducer from "./reducers/storeInformationReducer";
import postReducer from "./reducers/postReducer";
import storePostReducer from "./reducers/storePostReducer";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    storage: storeInformationReducer,
    newPost: postReducer,
    posts: storePostReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})