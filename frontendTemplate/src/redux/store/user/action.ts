
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import api from "../../api";
import { User } from "../../../data/data";

export const getUserList = createAsyncThunk('user/getUserList', async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/user/get-user-list')
      return data.map((item: any) => {
        return User.fromJSON(item);
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  })