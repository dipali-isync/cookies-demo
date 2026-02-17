import AxiosWrapper from "@/lib/axios/AxiosWrapper";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  ILoginResponseState,
  IUserResponseState,
  IUserState,
} from "../types/authentication";

export const LoginUser = createAsyncThunk(
  "auth/login",
  async (data: IUserState, { rejectWithValue }) => {
    try {
      const response = await AxiosWrapper.post<ILoginResponseState>(
        "/auth/login",
        data,
      );

      return response.data; // Return the response data on success
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Failed to fetch data");
      }
      return rejectWithValue("Failed to fetch data");
    }
  },
);

export const RegisterUser = createAsyncThunk(
  "auth/register",
  async (data: IUserState, { rejectWithValue }) => {
    try {
      const response = await AxiosWrapper.post<ILoginResponseState>(
        "/auth/register",
        data,
      );

      return response.data; // Return the response data on success
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Failed to fetch data");
      }
      return rejectWithValue("Failed to fetch data");
    }
  },
);

export const LogoutsUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await AxiosWrapper.post<ILoginResponseState>("/auth/logout");

      return response.data; // Return the response data on success
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Failed to fetch data");
      }
      return rejectWithValue("Failed to fetch data");
    }
  },
);

export const GetUser = createAsyncThunk(
  "auth/getUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await AxiosWrapper.post<IUserResponseState>("/auth/getUserData");

      return response.data; // Return the response data on success
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Failed to fetch data");
      }
      return rejectWithValue("Failed to fetch data");
    }
  },
);
