import { configureStore } from '@reduxjs/toolkit'
import {setupListeners} from "@reduxjs/toolkit/query";
import authReducer from './features/authSlice'
import {authApi} from "./services/auth";
import {users} from "./services/users";
import {categories} from "./services/categories"
import {articles} from "./services/articles";
import {images} from "./services/images";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [categories.reducerPath]: categories.reducer,
    [articles.reducerPath]: articles.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [users.reducerPath]: users.reducer,
    [images.reducerPath]: images.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([
      authApi.middleware,
      users.middleware,
      categories.middleware,
      articles.middleware,
      images.middleware

  ])

})

setupListeners(store.dispatch)