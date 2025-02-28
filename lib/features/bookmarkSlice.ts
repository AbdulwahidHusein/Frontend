import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ENDPOINTS } from "../config";
import { Job } from "@/types/types";

interface BookmarkJob {
  id: number;
  job_details: Job;
}

export interface BookmarkState {
  bookmarks: BookmarkJob[];
  loading: boolean;
  error: string | null;
}

const initialState: BookmarkState = {
  bookmarks: [],
  loading: false,
  error: null,
};

// Fetch bookmarks
export const fetchBookmarks = createAsyncThunk(
  "bookmarks/fetchBookmarks",
  async (token: string) => {
    const response = await axios.get(ENDPOINTS.BOOKMARK, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("API Response:", response.data);
    // Handle paginated response
    return response.data.results || [];
  }
);

// Add bookmark
export const addBookmark = createAsyncThunk(
  "bookmarks/addBookmark",
  async ({ jobId, token }: { jobId: number; token: string }, { rejectWithValue, dispatch }) => {
    try {
      console.log('Making POST request to add bookmark:', {
        url: ENDPOINTS.BOOKMARK,
        data: { job: jobId }
      });
      
      const response = await axios.post(
        ENDPOINTS.BOOKMARK,
        { job: jobId },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log("Add bookmark response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Add bookmark error:", {
        response: error.response?.data,
        status: error.response?.status
      });
      
      // If the error is that the bookmark already exists, fetch the current bookmarks
      if (error.response?.status === 400 && error.response?.data?.message === "Job already bookmarked.") {
        // Refresh the bookmarks list
        dispatch(fetchBookmarks(token));
        return null;
      }
      
      return rejectWithValue(error.response?.data?.message || "Failed to add bookmark");
    }
  }
);

// Remove bookmark
export const removeBookmark = createAsyncThunk(
  "bookmarks/removeBookmark",
  async ({ jobId, token }: { jobId: number; token: string }, { rejectWithValue }) => {
    try {
      console.log('Making DELETE request to remove bookmark:', {
        url: ENDPOINTS.BOOKMARK,
        data: { job: jobId }
      });
      
      const response = await axios.delete(ENDPOINTS.BOOKMARK, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { job: jobId }
      });
      
      console.log("Remove bookmark response:", response.data);
      return jobId;
    } catch (error: any) {
      console.error("Remove bookmark error:", {
        response: error.response?.data,
        status: error.response?.status
      });
      return rejectWithValue(error.response?.data?.message || "Failed to remove bookmark");
    }
  }
);

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch bookmarks
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        console.log("Setting bookmarks in state:", action.payload);
        state.bookmarks = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        console.error("Fetch bookmarks rejected:", action.error);
        state.loading = false;
        state.error = "Failed to fetch bookmarks";
      })
      // Add bookmark
      .addCase(addBookmark.fulfilled, (state, action) => {
        if (action.payload) {
          const exists = state.bookmarks.some(
            bookmark => bookmark.job_details.id === action.payload.job_details.id
          );
          if (!exists) {
            state.bookmarks.push(action.payload);
          }
        }
      })
      // Remove bookmark
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarks = state.bookmarks.filter(
          bookmark => bookmark.job_details.id !== action.payload
        );
      });
  },
});

export default bookmarkSlice.reducer; 