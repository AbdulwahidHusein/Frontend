import { configureStore } from "@reduxjs/toolkit";
import slice from "./features";
import bookmarkReducer, { BookmarkState } from "./features/bookmarkSlice";

const initialBookmarkState: BookmarkState = {
  bookmarks: [],
  loading: false,
  error: null
};

const store = configureStore({
  reducer: {
    jobs: slice.jobsReducer,
    auth: slice.authReducer,
    profile: slice.profileSlice,
    bookmarks: bookmarkReducer,
  },
  preloadedState: {
    bookmarks: initialBookmarkState
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
