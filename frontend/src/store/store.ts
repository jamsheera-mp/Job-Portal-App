import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../application/slices/authSlice';
import userReducer from '../application/slices/userSlice';
import jobReducer from '../application/slices/jobSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    jobs: jobReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;