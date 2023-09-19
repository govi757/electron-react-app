import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserList } from "./action";
import { User } from "../../../data/data";



interface UserState {
    userList: User[],
    loading: boolean,
    error: string | null,
    updatedUserList: User[]
}

const initialState: UserState = {
    userList: [],
    loading: false,
    error: null,
    updatedUserList: []
}

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetUserList: (state) => {
            state = initialState;
        }
    }, 
    extraReducers: (builder) =>{
        builder.addCase(getUserList.pending, state => {
            state.loading = true;
            state.error = null;
        }).addCase(getUserList.fulfilled,(state, action) => {
            state.loading = false;
            state.userList = action.payload;
            state.error = null;
        }).addCase(getUserList.rejected, (state, action) => {
            state.loading = false;
            state.userList = [];
            state.error = action.payload as string;
          });
    }
});
export default UserSlice.reducer;