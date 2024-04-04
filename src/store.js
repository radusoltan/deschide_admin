import { configureStore } from '@reduxjs/toolkit'
import {setupListeners} from "@reduxjs/toolkit/query";
import authReducer from './features/authSlice'
import {authApi} from "./services/auth";
import {users} from "./services/users";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [users.reducerPath]: users.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([
      authApi.middleware,
      users.middleware

  ])

})

setupListeners(store.dispatch)