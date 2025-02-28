import { ProfileState } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ProfileState = {
  refresh: "",
  access: "",
  user: {
    id: 0,
    email: "",
    first_name: "",
    last_name: "",
  },
  profile: {
    id: 0,
    user: {
      id: 0,
      email: "",
      first_name: "",
      last_name: "",
    },
    country: "",
    city: "",
    phone_number: "",
    profile_image_uri: "",
    bio: "",
    prefered_tech_stacks: [],
    resume_uri: "",
    preferred_job_types: [],
    prefered_work_arrangement: "",
    summary_from_resume: "",
  },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<ProfileState>) {
      state.refresh = action.payload.refresh;
      state.access = action.payload.access;
      state.user = action.payload.user;
      state.profile = action.payload.profile;
    },
    clearProfile(state) {
      state.refresh = "";
      state.access = "";
      state.user = initialState.user;
      state.profile = initialState.profile;
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
