import { configureStore } from '@reduxjs/toolkit'
import { GeneratedReducers } from './generatedReducers'
export const store = configureStore({
    reducer: {
        ...GeneratedReducers,
    },
  })
  export type RootState = ReturnType<typeof store.getState>  

  export type AppDispatch = typeof store.dispatch


