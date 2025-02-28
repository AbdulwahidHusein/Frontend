// features/jobs/jobsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import fetch from "../api/jobApi";
import { ResponseJob, JobsState } from "../../types/types";
import axios from "axios";
import { ENDPOINTS } from "../config";

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async ({ nextUrl, job_title, work_arrangement, job_type, token }: { 
    nextUrl: string; 
    job_title: string; 
    work_arrangement: string; 
    job_type: string;
    token?: string;
  }, { rejectWithValue }) => {
    try {
      const url = nextUrl || ENDPOINTS.JOBS;
      const params = new URLSearchParams();
      if (job_title) params.append('job_title', job_title);
      if (work_arrangement) params.append('work_arrangement', work_arrangement);
      if (job_type) params.append('job_type', job_type);

      const config: any = {};
      if (token) {
        config.headers = {
          'Authorization': `Bearer ${token}`
        };
      }

      const response = await axios.get(`${url}${params.toString() ? '?' + params.toString() : ''}`, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || "Failed to fetch jobs");
    }
  }
);

const initialState: JobsState = {
  jobs: {
    results: [],
    count: 0,
    next: null,
    previous: null,
  },
  loading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchJobs.fulfilled,
        (state, action: PayloadAction<ResponseJob>) => {
          state.loading = false;
          state.jobs = action.payload;
        }
      )
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : "Something went wrong";
      });
  },
});
export const { setLoading } = jobsSlice.actions;
export default jobsSlice.reducer;
