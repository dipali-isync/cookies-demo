import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserResponseState } from "../types/authentication";
import { GetUser } from "../actions/authenticationAction";

interface IAuthState {
  isAuthenticated: boolean;
  userRes: null | IUserResponseState;
  loading: boolean;
  error: null | unknown | string;
}

const initialState: IAuthState = {
  isAuthenticated: false,
  loading: false,
  error: "",
  userRes: null,
};

const authenticationSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        GetUser.fulfilled,
        (state, action: PayloadAction<IUserResponseState>) => {
          state.loading = false;
          state.userRes = action.payload;
        },
      )
      .addCase(GetUser.rejected, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setIsAuthenticated, setLoading } = authenticationSlice.actions;
const authenticationReducer = authenticationSlice.reducer;
export default authenticationReducer;
