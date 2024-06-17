import { createSlice } from "@reduxjs/toolkit";

export const getEntitySlice = createSlice({
  name: "getEntity",
  initialState: {
    shouldCallMethod: false,
  },
  reducers: {
    callMethod: (state) => {
      state.shouldCallMethod = true;
    },
    resetMethodCall: (state) => {
      state.shouldCallMethod = false;
    },
  },
});

export const { callMethod, resetMethodCall } = getEntitySlice.actions;

export default getEntitySlice.reducer;
