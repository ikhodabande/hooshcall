import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type PageType = "dashboard" | "email" | "contacts" | "messages" | "settings" | "profile"

interface AppState {
  currentPage: PageType
  currentTime: string
}

const initialState: AppState = {
  currentPage: "dashboard",
  currentTime: new Date().toLocaleString("fa-IR"),
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
  },
})

export const { setCurrentPage, updateTime } = appSlice.actions

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
