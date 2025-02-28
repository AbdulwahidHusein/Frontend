import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createProfile, updateProfile } from "../api/profile";
import { getProfile } from "../api/profile";
import { UserProfile } from "@/types/types";
interface ProfileState {
  loading: boolean;
  error: boolean;
  success: boolean;
  userProfile: UserProfile;
}

const initialState: ProfileState = {
  loading: false,
  error: false,
  success: false,
  userProfile: {},
};

export const createProfileAsync = createAsyncThunk(
  "profile/createProfile",
  async (
    {
      formData,
      token,
      isCreate,
    }: { formData: FormData; token: string; isCreate: boolean },
    { rejectWithValue }
  ) => {
    try {
      if (isCreate) {
        return await createProfile(formData, token);
      } else {
        return await updateProfile(formData, token);
      }
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getProfileAsync = createAsyncThunk(
  "profile/getProfile",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await getProfile(token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
      state.userProfile = {} as UserProfile;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(createProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.userProfile = action.payload;
      })
      .addCase(createProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
      })
      .addCase(getProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.userProfile = action.payload;
      })
      .addCase(getProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
      });
  },
});

export const { resetState } = profileSlice.actions;

export default profileSlice.reducer;
