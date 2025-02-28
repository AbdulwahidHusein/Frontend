import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import registerUser from "@/lib/api/authApi";
import { RegistrationData } from "@/types/types";

interface AuthState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  success: false,
};

export const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async (data: RegistrationData, { rejectWithValue }) => {
    try {
      const response = await registerUser(data);
      return response;
    } catch (error: any) {
      // Handle error message from the API or use error message from Error object
      const errorMessage = error.message || "Registration failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetState } = authSlice.actions;
export default authSlice.reducer;
