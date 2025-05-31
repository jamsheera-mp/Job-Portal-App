import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, loading: false, error: null },
  reducers: {},
});

export default jobSlice.reducer;