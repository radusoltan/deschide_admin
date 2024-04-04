import {createSlice} from "@reduxjs/toolkit"
import {userLogin} from "./authActions";

const token = localStorage.getItem('userToken')
  ? localStorage.getItem('userToken')
  : null

const initialState = {
  loading: false,
  userInfo: null,
  permissions: [],
  token,
  error: null,
  success: false
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: state => {
      localStorage.removeItem('userToken')
      state.loading = false
      state.userInfo = null
      state.userToken = null
      state.error = null
      state.permissions = []
      window.location = '/login'
    },
    setCredentials: (state,{payload})=>{

      const permissions = payload.roles.map(role=>role.permissions)

      state.userInfo = payload.user
      state.permissions = permissions.flat()
      state.success = true
    }
  },
  extraReducers: builder => {
    builder
      .addCase(userLogin.pending, (state,{payload})=>{
        state.loading = true
        state.error = null
      })
      .addCase(userLogin.fulfilled, (state, {payload})=>{
        state.loading = false
        state.userInfo = payload.user
        state.token = payload.token
        state.success = true
      })
      .addCase(userLogin.rejected,(state,{payload})=>{
        state.loading = false
        state.error = payload
        state.success = false
      })
  }
})

export const {logout, setCredentials} = authSlice.actions
export default authSlice.reducer