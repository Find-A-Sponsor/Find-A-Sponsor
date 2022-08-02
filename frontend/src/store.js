import usersReducer from "./reducers/usersReducer";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import storeInformationReducer from "./reducers/storeInformationReducer";
import postReducer from "./reducers/postReducer";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    storage: storeInformationReducer,
    newPost: postReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})