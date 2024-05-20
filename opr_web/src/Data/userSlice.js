// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    roles: [],
    modules: [],
  },
  reducers: {
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    setModules: (state, action) => {
      state.modules = action.payload;
    },
  },
});

export const { setRoles, setModules } = userSlice.actions;

export default userSlice.reducer;
