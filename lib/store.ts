import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type PageType =
  | "dashboard"
  | "email"
  | "contacts"
  | "contacts-list"
  | "user-calls"
  | "messages"
  | "settings"
  | "profile"

export type UserRole = "admin" | "user"

interface User {
  username: string
  role: UserRole
}

interface AppState {
  currentPage: PageType
  currentTime: string
  user: User | null
  isAuthenticated: boolean
}

const initialState: AppState = {
  currentPage: "dashboard",
  currentTime: new Date().toLocaleString("fa-IR"),
  user: null,
  isAuthenticated: false,
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<PageType>) => {
      state.currentPage = action.payload
    },
    updateTime: (state, action: PayloadAction<string>) => {
      state.currentTime = action.payload
    },
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      // Set default page based on role
      state.currentPage = action.payload.role === "admin" ? "dashboard" : "user-calls"
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.currentPage = "dashboard"
    },
  },
})

export const { setCurrentPage, updateTime, login, logout } = appSlice.actions

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
