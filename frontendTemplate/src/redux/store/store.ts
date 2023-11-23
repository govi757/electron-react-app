import { configureStore } from '@reduxjs/toolkit'
import { GeneratedReducers } from './generatedReducers'
import SnackbarReducer from './snackbar/snackbarSlice'
export const store = configureStore({
    reducer: {
        ...GeneratedReducers,
        snackbar: SnackbarReducer
    },
  })
  export type RootState = ReturnType<typeof store.getState>  

  export type AppDispatch = typeof store.dispatch


