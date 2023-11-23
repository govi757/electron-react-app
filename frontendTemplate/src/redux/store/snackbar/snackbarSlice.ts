import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export interface SnackbarRequest {
    type: SnackbarType,
    message: string,
    timing: number
}

export enum SnackbarType {
    Success="success",
    Error="error",
}


interface SnackbarState {
    snackbarRequestList: SnackbarRequest[]
}

const initialState:SnackbarState = {
    snackbarRequestList: []
}


export const snackbarSlice=  createSlice({
    name: "Snackbar",
    initialState: initialState,
    reducers: {
        addSnackbar: (state, action: {type:String,payload: SnackbarRequest}) => {
            state.snackbarRequestList.push(action.payload);
        },
        removeLastSnackbar: (state) => {
            state.snackbarRequestList.pop();
        },
    }
});


export const {addSnackbar,removeLastSnackbar} = snackbarSlice.actions;

export default snackbarSlice.reducer;